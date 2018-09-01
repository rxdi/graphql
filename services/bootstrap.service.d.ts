import { ModuleService, BootstrapLogger } from '@rxdi/core';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { HookService } from '../services/hooks.service';
import { SchemaService } from '../services/schema.service';
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
export declare class BootstrapService {
    private moduleService;
    private hookService;
    private schemaService;
    private effectService;
    private logger;
    private config;
    constructor(moduleService: ModuleService, hookService: HookService, schemaService: SchemaService, effectService: EffectService, logger: BootstrapLogger, config: GRAPHQL_PLUGIN_CONFIG);
    validateGuard(res: any): Promise<void>;
    applyGuards(desc: any, a: any): Promise<void>;
    generateSchema(): GraphQLSchema;
    writeEffectTypes(effects: Array<any>): void;
    generateType(query: any, name: any, description: any): GraphQLObjectType;
    applyGlobalControllerOptions(): void;
    getMetaDescriptors(): MetaDescriptor[];
}
