import { ModuleService, Service, Injector, Inject, Container, BootstrapLogger } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { HookService } from '../services/hooks.service';
import { SchemaService } from '../services/schema.service';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import { EffectService } from './effect.service';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { GenericGapiResolversType } from '../decorators/query/query.decorator';
import { CanActivateResolver } from '../decorators/guard/guard.interface';
import { Observable, from } from 'rxjs';
import { InterceptResolver } from '../decorators/intercept/intercept.interface';

export class FieldsModule { query: {}; mutation: {}; subscription: {}; }
export class MetaDescriptor { descriptor: () => GenericGapiResolversType; self: any; }

@Service()
export class BootstrapService {

    constructor(
        private moduleService: ModuleService,
        private hookService: HookService,
        private schemaService: SchemaService,
        private effectService: EffectService,
        private logger: BootstrapLogger,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG
    ) { }

    async validateGuard(res) {
        if (res.constructor === Boolean) {
            if (!res) {
                this.logger.error(`Guard activated!`);
                throw new Error('unauthorized');
            }
        } else if (res.constructor === Promise) {
            await this.validateGuard(await res);
        } else if (res.constructor === Observable) {
            await this.validateGuard((await res['toPromise']()));
        }
    }

    async applyGuards(desc, a) {
        const args = a;
        await Promise.all(desc.guards.map(async (guard) => {
            const currentGuard = Container.get<CanActivateResolver>(guard);
            const originalResolve = currentGuard.canActivate;
            currentGuard.canActivate = function () {
                let tempArgs = null;
                if (args.length && args[2]) {
                    tempArgs = args[2];
                }
                return originalResolve.bind(currentGuard)(tempArgs);
            };
            // binding here is when we want to use custom decorated metods inside canResolve override
            await this.validateGuard(currentGuard.canActivate.bind(currentGuard)());
        }));
    }

    generateSchema(): GraphQLSchema {
        const methodBasedEffects = [];
        const Fields = { query: {}, mutation: {}, subscription: {} };
        const events = this.effectService;
        const currentConstructor = this;
        this.applyGlobalControllerOptions();
        this.getMetaDescriptors()
            .forEach(({ descriptor, self }) => {
                const desc = descriptor();
                Fields[desc.method_type][desc.method_name] = desc;
                const effectName = desc.effect ? desc.effect : desc.method_name;
                methodBasedEffects.push(effectName);
                const originalResolve = desc.resolve.bind(self);

                if (desc.subscribe) {
                    const originalSubscribe = desc.subscribe;
                    desc.subscribe = function subscribe(...args: any[]) {
                        return originalSubscribe.bind(self)(self, ...args);
                    };
                }

                desc.resolve = async function resolve(...args: any[]) {
                    const methodEffect = events.map.has(desc.method_name);
                    const customEffect = events.map.has(desc.effect);

                    if (!desc.public && desc.guards && desc.guards.length && currentConstructor.config.authentication) {
                        await currentConstructor.applyGuards(desc, args);
                    }

                    let observable = from(originalResolve.apply(self, args));

                    if (desc.interceptor) {
                        observable = Container
                            .get<InterceptResolver>(desc.interceptor)
                            .intercept(observable, args[1], args[2], desc);
                    }

                    const result = await observable.toPromise();
                    if (methodEffect || customEffect) {
                        let tempArgs = [result, ...args];
                        tempArgs = tempArgs.filter(i => i && i !== 'undefined');
                        events
                            .getLayer<Array<any>>(effectName)
                            .putItem({ key: effectName, data: tempArgs });
                    }
                    return result;
                };
            });

        const query = this.generateType(
            Fields.query,
            'Query',
            'Query type for all get requests which will not change persistent data'
        );

        const mutation = this.generateType(
            Fields.mutation,
            'Mutation',
            'Mutation type for all requests which will change persistent data'
        );

        const subscription = this.generateType(
            Fields.subscription,
            'Subscription',
            'Subscription type for all rabbitmq subscriptions via pub sub'
        );

        this.hookService.AttachHooks([query, mutation, subscription]);
        const schema = this.schemaService.generateSchema(query, mutation, subscription);

        try {
            this.writeEffectTypes(methodBasedEffects);
        } catch (e) {
            console.error(e, 'Effects are not saved to directory');
        }
        return schema;
    }

    writeEffectTypes(effects: Array<any>) {
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
        ensureDirSync(folder);
        writeFileSync(folder + 'EffectTypes.ts', types, 'utf8');
    }

    generateType(query, name, description) {
        if (!Object.keys(query).length) {
            return;
        }
        return new GraphQLObjectType({
            name: name,
            description: description,
            fields: query
        });
    }

    applyGlobalControllerOptions() {
        Array.from(this.moduleService.watcherService._constructors.keys())
            .filter(key => this.moduleService.watcherService.getConstructor(key)['type']['metadata']['type'] === 'controller')
            .map(key => {
                const currentConstructor: { value: any; type: { _descriptors: Map<any, any> } } = <any>this.moduleService.watcherService.getConstructor(key);
                const options = currentConstructor.type['metadata'].options;
                Array.from(currentConstructor.type._descriptors.keys()).map((k => {
                    if (options) {
                        const orig = currentConstructor.type._descriptors.get(k);
                        const descriptor = orig.value();
                        if (options.scope) {
                            descriptor.scope = descriptor.scope || options.scope;
                        }
                        if (options.guards && options.guards.length && !descriptor.public) {
                            let descriptorGuards = [];
                            if (descriptor.guards && descriptor.guards.length) {
                                descriptorGuards = descriptor.guards;
                            }
                            descriptor.guards = [...descriptorGuards, ...options.guards];
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

    getMetaDescriptors(): MetaDescriptor[] {
        const descriptors: MetaDescriptor[] = [];
        Array.from(this.moduleService.watcherService._constructors.keys())
            .filter(key => this.moduleService.watcherService.getConstructor(key)['type']['metadata']['type'] === 'controller')
            .map((key => <any>this.moduleService.watcherService.getConstructor(key)))
            .forEach((map: { value: any; type: { _descriptors: Map<any, any> } }) => Array.from(map.type._descriptors.keys())
                .map((k) => map.type._descriptors.get(k))
                .map(d => d.value)
                .forEach(v => descriptors.push({ descriptor: v, self: map.value })));
        return descriptors;
    }

}