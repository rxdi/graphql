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
const schema_service_1 = require("../services/schema.service");
const fs_extra_1 = require("fs-extra");
const effect_service_1 = require("./effect.service");
const config_tokens_1 = require("../config.tokens");
class FieldsModule {
}
exports.FieldsModule = FieldsModule;
class MetaDescriptor {
}
exports.MetaDescriptor = MetaDescriptor;
let BootstrapService = class BootstrapService {
    constructor(moduleService, hookService, schemaService, effectService, config) {
        this.moduleService = moduleService;
        this.hookService = hookService;
        this.schemaService = schemaService;
        this.effectService = effectService;
        this.config = config;
    }
    generateSchema() {
        const methodBasedEffects = [];
        const Fields = { query: {}, mutation: {}, subscription: {} };
        const events = this.effectService;
        this.getMetaDescriptors()
            .forEach(({ descriptor, self }) => {
            const desc = descriptor();
            Fields[desc.method_type][desc.method_name] = desc;
            const effectName = desc.effect ? desc.effect : desc.method_name;
            methodBasedEffects.push(effectName);
            const originalResolve = desc.resolve.bind(self);
            if (desc.subscribe) {
                const originalSubscribe = desc.subscribe;
                desc.subscribe = function subscribe(...args) {
                    return originalSubscribe.bind(self)(self, ...args);
                };
            }
            desc.resolve = function resolve(...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const methodEffect = events.map.has(desc.method_name);
                    const customEffect = events.map.has(desc.effect);
                    const result = yield originalResolve.apply(self, args);
                    if (methodEffect || customEffect) {
                        let tempArgs = [result, ...args];
                        tempArgs = tempArgs.filter(i => i && i !== 'undefined');
                        events
                            .getLayer(effectName)
                            .putItem({ key: effectName, data: tempArgs });
                    }
                    return result;
                });
            };
        });
        const query = this.generateType(Fields.query, 'Query', 'Query type for all get requests which will not change persistent data');
        const mutation = this.generateType(Fields.mutation, 'Mutation', 'Mutation type for all requests which will change persistent data');
        const subscription = this.generateType(Fields.subscription, 'Subscription', 'Subscription type for all rabbitmq subscriptions via pub sub');
        this.hookService.AttachHooks([query, mutation, subscription]);
        const schema = this.schemaService.generateSchema(query, mutation, subscription);
        try {
            this.writeEffectTypes(methodBasedEffects);
        }
        catch (e) {
            console.error(e, 'Effects are not saved to directory');
        }
        return schema;
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
        const folder = process.env.INTROSPECTION_FOLDER || `./src/app/core/api-introspection/`;
        fs_extra_1.ensureDirSync(folder);
        fs_extra_1.writeFileSync(folder + 'EffectTypes.ts', types, 'utf8');
    }
    generateType(query, name, description) {
        if (!Object.keys(query).length) {
            return;
        }
        return new graphql_1.GraphQLObjectType({
            name: name,
            description: description,
            fields: query
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
BootstrapService = __decorate([
    core_1.Service(),
    __param(4, core_1.Inject(config_tokens_1.GRAPHQL_PLUGIN_CONFIG)),
    __metadata("design:paramtypes", [core_1.ModuleService,
        hooks_service_1.HookService,
        schema_service_1.SchemaService,
        effect_service_1.EffectService, Object])
], BootstrapService);
exports.BootstrapService = BootstrapService;