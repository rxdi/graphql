import { ModuleService, BootstrapLogger } from '@rxdi/core';
import { GraphQLSchema, GraphQLFieldConfigMap } from 'graphql';
import { EffectService } from './effect.service';
import { GRAPHQL_PLUGIN_CONFIG, Neo4JInjectionInterface } from '../config.tokens';
import { GenericGapiResolversType } from '../decorators/query/query.decorator';
export declare class FieldsModule {
    query: {};
    mutation: {};
    subscription: {};
}
export declare class MetaDescriptor {
    descriptor: () => GenericGapiResolversType;
    self: any;
}
export interface CurrentConstructorInteraface {
    value: any;
    type: {
        _descriptors: Map<string, {
            value: () => GenericGapiResolversType;
        }>;
    };
}
export declare class BootstrapService {
    private moduleService;
    private effectService;
    private logger;
    private config;
    private hookService;
    methodBasedEffects: any[];
    neo4j: Neo4JInjectionInterface;
    constructor(moduleService: ModuleService, effectService: EffectService, logger: BootstrapLogger, config: GRAPHQL_PLUGIN_CONFIG);
    validateGuard(res: Function): Promise<void>;
    applyGuards(desc: GenericGapiResolversType, a: any): Promise<void>;
    getResolverByName(resolverName: string): import("graphql/type/definition").GraphQLFieldConfig<any, any, {
        [key: string]: any;
    }>;
    collectAppSchema(): {
        query: GraphQLFieldConfigMap<any, any, {
            [key: string]: any;
        }>;
        mutation: GraphQLFieldConfigMap<any, any, {
            [key: string]: any;
        }>;
        subscription: GraphQLFieldConfigMap<any, any, {
            [key: string]: any;
        }>;
    };
    applyMetaToResolvers(desc: GenericGapiResolversType, self: any): void;
    generateSchema(): GraphQLSchema;
    private generateType;
    private writeEffectTypes;
    private applyGlobalControllerOptions;
    getMetaDescriptors(): MetaDescriptor[];
}
