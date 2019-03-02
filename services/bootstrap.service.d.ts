import { ModuleService, BootstrapLogger } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema, GraphQLFieldConfigMap } from 'graphql';
import { EffectService } from './effect.service';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
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
export interface InternalFields {
    query: GraphQLFieldConfigMap<any, any>;
    mutation: GraphQLFieldConfigMap<any, any>;
    subscription: GraphQLFieldConfigMap<any, any>;
}
export declare class BootstrapService {
    private moduleService;
    private effectService;
    private logger;
    private config;
    methodBasedEffects: any[];
    Fields: InternalFields;
    constructor(moduleService: ModuleService, effectService: EffectService, logger: BootstrapLogger, config: GRAPHQL_PLUGIN_CONFIG);
    validateGuard(res: Function): Promise<void>;
    applyGuards(desc: GenericGapiResolversType, a: any): Promise<void>;
    getResolverByName(resolverName: string): import("graphql/type/definition").GraphQLFieldConfig<any, any, {
        [key: string]: any;
    }>;
    validateResolver(desc: GenericGapiResolversType, self: Function): void;
    applyInitStatus(): {
        type: GraphQLObjectType<any, any, {
            [key: string]: any;
        }>;
        method_name: string;
        method_type: string;
        target: () => void;
        resolve: () => {
            status: number;
        };
    };
    collectAppSchema(): InternalFields;
    applyMetaToResolvers(desc: GenericGapiResolversType, self: any): void;
    generateSchema(): GraphQLSchema;
    private generateType;
    writeEffectTypes(effects?: Array<string>): void;
    private applyGlobalControllerOptions;
    getMetaDescriptors(): MetaDescriptor[];
}
