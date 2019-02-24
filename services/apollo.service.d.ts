import { PluginInterface } from '@rxdi/core';
import { Server, Request, ResponseToolkit } from 'hapi';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { BootstrapService } from '../services/bootstrap.service';
export declare class ApolloService implements PluginInterface {
    private server;
    private config;
    private bootstrapService;
    constructor(server: Server, config: GRAPHQL_PLUGIN_CONFIG, bootstrapService: BootstrapService);
    OnInit(): void;
    register(): void;
    defaultOrNew: (request: Request, response: ResponseToolkit, error: Error) => Promise<any>;
    makeGQLRequest(request: Request, h: ResponseToolkit, err?: Error): Promise<import("hapi").ResponseObject>;
    handler: (request: Request, h: ResponseToolkit, err?: Error) => Promise<any>;
}
