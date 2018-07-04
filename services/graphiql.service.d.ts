import { PluginInterface } from '@rxdi/core';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { Server } from 'hapi';
export declare class GraphiQLService implements PluginInterface {
    private server;
    private config;
    constructor(server: Server, config: GRAPHQL_PLUGIN_CONFIG);
    OnInit(): void;
    register(): Promise<void>;
    handler(request: any, h: any): Promise<any>;
}
