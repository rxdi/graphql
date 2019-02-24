"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const graphql_1 = require("graphql");
const hooks_service_1 = require("../services/hooks.service");
const fs_extra_1 = require("fs-extra");
const effect_service_1 = require("./effect.service");
const config_tokens_1 = require("../config.tokens");
const rxjs_1 = require("rxjs");
// import { makeExecutableSchema, addMockFunctionsToSchema, mergeSchemas, } from 'graphql-tools';
class FieldsModule {
}
exports.FieldsModule = FieldsModule;
class MetaDescriptor {
}
exports.MetaDescriptor = MetaDescriptor;
let BootstrapService = class BootstrapService {
    constructor(moduleService, effectService, logger, config) {
        this.moduleService = moduleService;
        this.effectService = effectService;
        this.logger = logger;
        this.config = config;
        this.methodBasedEffects = [];
        try {
            this.neo4j = core_1.Container.get('neo4j-graphql-js');
        }
        catch (e) { }
    }
    validateGuard(res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (res.constructor === Boolean) {
                if (!res) {
                    this.logger.error(`Guard activated!`);
                    throw new Error('unauthorized');
                }
            }
            else if (res.constructor === Promise) {
                yield this.validateGuard(yield res);
            }
            else if (res.constructor === rxjs_1.Observable) {
                yield this.validateGuard((yield res['toPromise']()));
            }
        });
    }
    applyGuards(desc, a) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = a;
            yield Promise.all(desc.guards.map((guard) => __awaiter(this, void 0, void 0, function* () {
                const currentGuard = core_1.Container.get(guard);
                yield this.validateGuard(currentGuard.canActivate.bind(currentGuard)(args[2], args[1], desc));
            })));
        });
    }
    getResolverByName(resolverName) {
        return this.collectAppSchema().query[resolverName] || this.collectAppSchema().mutation[resolverName] || this.collectAppSchema().subscription[resolverName];
    }
    collectAppSchema() {
        const Fields = { query: {}, mutation: {}, subscription: {} };
        this.applyGlobalControllerOptions();
        this.getMetaDescriptors()
            .forEach(({ descriptor }) => {
            const desc = descriptor();
            Fields[desc.method_type][desc.method_name] = desc;
        });
        return Fields;
    }
    applyMetaToResolvers(desc, self) {
        const events = this.effectService;
        const currentConstructor = this;
        const effectName = desc.effect ? desc.effect : desc.method_name;
        this.methodBasedEffects = [];
        this.methodBasedEffects.push(effectName);
        const originalResolve = desc.resolve.bind(self);
        if (desc.subscribe) {
            const originalSubscribe = desc.subscribe;
            desc.subscribe = function subscribe(...args) {
                return originalSubscribe.bind(self)(self, ...args);
            };
        }
        desc.resolve = function resolve(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!desc.public
                    && desc.guards && desc.guards.length
                    && currentConstructor.config.authentication) {
                    yield currentConstructor.applyGuards(desc, args);
                }
                let val = originalResolve.apply(self, args);
                if (!val && !process.env.STRICT_RETURN_TYPE) {
                    val = {};
                }
                if (!val && process.env.STRICT_RETURN_TYPE) {
                    throw new Error(`Return type of graph: ${desc.method_name} is undefined or null \n To remove strict return type check remove environment variable STRICT_RETURN_TYPE=true`);
                }
                if (val.constructor === Object
                    || val.constructor === Array
                    || val.constructor === String
                    || val.constructor === Number) {
                    val = rxjs_1.of(val);
                }
                let observable = rxjs_1.from(val);
                if (desc.interceptor) {
                    observable = yield core_1.Container
                        .get(desc.interceptor)
                        .intercept(observable, args[2], args[1], desc);
                }
                let result;
                if (observable.constructor === Object) {
                    result = observable;
                }
                else {
                    result = yield observable.toPromise();
                }
                if (events.map.has(desc.method_name) || events.map.has(desc.effect)) {
                    events
                        .getLayer(effectName)
                        .putItem({ key: effectName, data: [result, ...args].filter(i => i && i !== 'undefined') });
                }
                return result;
            });
        };
    }
    generateSchema() {
        const Fields = this.collectAppSchema();
        let schema = new graphql_1.GraphQLSchema({
            query: this.generateType(Fields.query, 'Query', 'Query type for all get requests which will not change persistent data'),
            mutation: this.generateType(Fields.mutation, 'Mutation', 'Mutation type for all requests which will change persistent data'),
            subscription: this.generateType(Fields.subscription, 'Subscription', 'Subscription type for all subscriptions via pub sub')
        });
        schema = graphql_1.buildSchema(graphql_1.printSchema(schema));
        if (this.neo4j) {
            schema = this.neo4j.makeAugmentedSchema({ typeDefs: graphql_1.printSchema(schema) });
        }
        // console.log(schema.getQueryType().getFields());
        // Build astNode https://github.com/graphql/graphql-js/issues/1575
        this.hookService.AttachHooks([schema.getQueryType(), schema.getMutationType(), schema.getSubscriptionType()]);
        this.writeEffectTypes(this.methodBasedEffects);
        return schema;
    }
    generateType(fields, name, description) {
        if (!Object.keys(fields).length) {
            return;
        }
        return new graphql_1.GraphQLObjectType({ name, description, fields });
    }
    writeEffectTypes(effects) {
        if (!this.config.writeEffects) {
            return;
        }
        const types = `
/* tslint:disable */
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const EffectTypes = strEnum(${JSON.stringify(effects).replace(/'/g, `'`).replace(/,/g, ',\n')});
export type EffectTypes = keyof typeof EffectTypes;
`;
        try {
            const folder = process.env.INTROSPECTION_FOLDER || `./src/app/core/api-introspection/`;
            fs_extra_1.ensureDirSync(folder);
            fs_extra_1.writeFileSync(folder + 'EffectTypes.ts', types, 'utf8');
        }
        catch (e) {
            console.error(e, 'Effects are not saved to directory');
        }
    }
    applyGlobalControllerOptions() {
        Array.from(this.moduleService.watcherService._constructors.keys())
            .filter(key => this.moduleService.watcherService.getConstructor(key)['type']['metadata']['type'] === 'controller')
            .map(key => {
            const currentConstructor = this.moduleService.watcherService.getConstructor(key);
            const options = currentConstructor.type['metadata'].options;
            currentConstructor.type._descriptors = currentConstructor.type._descriptors || [];
            Array.from(currentConstructor.type._descriptors.keys()).map((k => {
                if (options) {
                    const orig = currentConstructor.type._descriptors.get(k);
                    const descriptor = orig.value();
                    if (options.scope) {
                        descriptor.scope = descriptor.scope || options.scope;
                    }
                    if (options.guards && options.guards.length && !descriptor.public) {
                        descriptor.guards = descriptor.guards || options.guards;
                    }
                    if (options.type) {
                        descriptor.type = descriptor.type || options.type;
                    }
                    if (options.interceptor && !descriptor.interceptor) {
                        descriptor.interceptor = options.interceptor;
                    }
                    orig.value = () => descriptor;
                    currentConstructor.type._descriptors.set(k, orig);
                }
            }));
            return key;
        });
    }
    getMetaDescriptors() {
        const descriptors = [];
        Array.from(this.moduleService.watcherService._constructors.keys())
            .filter(key => this.moduleService.watcherService.getConstructor(key)['type']['metadata']['type'] === 'controller')
            .map((key => this.moduleService.watcherService.getConstructor(key)))
            .forEach((map) => Array.from(map.type._descriptors.keys())
            .map((k) => map.type._descriptors.get(k))
            .map(d => d.value)
            .forEach(v => descriptors.push({ descriptor: v, self: map.value })));
        return descriptors;
    }
};
__decorate([
    core_1.Inject(() => hooks_service_1.HookService),
    __metadata("design:type", hooks_service_1.HookService)
], BootstrapService.prototype, "hookService", void 0);
BootstrapService = __decorate([
    core_1.Service(),
    __param(3, core_1.Inject(config_tokens_1.GRAPHQL_PLUGIN_CONFIG)),
    __metadata("design:paramtypes", [core_1.ModuleService,
        effect_service_1.EffectService,
        core_1.BootstrapLogger, Object])
], BootstrapService);
exports.BootstrapService = BootstrapService;
