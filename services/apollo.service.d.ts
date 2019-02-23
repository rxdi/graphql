import { PluginInterface } from '@rxdi/core';
import * as Boom from 'boom';
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
    handler: (request: Request, h: ResponseToolkit, err?: Error) => Promise<Boom<null> | import("hapi").ResponseObject>;
}
