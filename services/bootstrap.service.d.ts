import { ModuleService } from "@rxdi/core";
import { HookService } from "../services/hooks.service";
import { SchemaService } from "../services/schema.service";
import { EffectService } from "./effect.service";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
export declare class BootstrapService {
    private moduleService;
    private hookService;
    private schemaService;
    private effectService;
    private config;
    constructor(moduleService: ModuleService, hookService: HookService, schemaService: SchemaService, effectService: EffectService, config: GRAPHQL_PLUGIN_CONFIG);
    generateSchema(): any;
    writeEffectTypes(effects: Array<any>): void;
    generateType(query: any, name: any, description: any): any;
    getDescriptors(): any[];
}
