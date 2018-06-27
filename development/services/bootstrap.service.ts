import { ModuleService, Service, Injector, Inject } from "@rxdi/core";
import { GraphQLObjectType } from "graphql";
import { HookService } from "../services/hooks.service";
import { SchemaService } from "../services/schema.service";
import { ensureDirSync, writeFileSync } from "fs-extra";
import { EffectService } from "./effect.service";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
import { GenericGapiResolversType } from "../decorators/query/query.decorator";

export class FieldsModule { query: {}; mutation: {}; subscription: {} }
export class MetaDescriptor { descriptor: () => GenericGapiResolversType; self: any }

@Service()
export class BootstrapService {

    constructor(
        private moduleService: ModuleService,
        private hookService: HookService,
        private schemaService: SchemaService,
        private effectService: EffectService,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG
    ) { }

    generateMetaSchema(): [FieldsModule, string[]] {
        const methodBasedEffects = [];
        const Fields = new FieldsModule();
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
                    desc.subscribe = function subscribe(...args: any[]) {
                        return originalSubscribe.bind(self)(self, ...args);
                    }
                }

                desc.resolve = async function resolve(...args: any[]) {
                    const methodEffect = events.map.has(desc.method_name);
                    const customEffect = events.map.has(desc.effect);
                    const result = await originalResolve.apply(self, args);
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
        return [Fields, methodBasedEffects];

    }

    generateSchema() {
        const metaSchema = this.generateMetaSchema();
        const Fields = metaSchema[0];
        const methodBasedEffects = metaSchema[1];

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
        if (this.config.writeEffects) {
            return;
        }
        const types = `
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const EffectTypes = strEnum(${JSON.stringify(effects).replace(/"/g, `'`).replace(/,/g, ',\n')});
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