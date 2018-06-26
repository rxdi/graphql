import { PluginInterface } from "@rxdi/core";
import { Server } from 'hapi';
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
import { BootstrapService } from '../services/bootstrap.service';
export interface IRegister {
    (server: Server, options: any): void;
}
export interface IPlugin {
    name: string;
    version?: string;
    register: IRegister;
}
export declare class ApolloService implements PluginInterface {
    private server;
    private config;
    private bootstrapService;
    constructor(server: Server, config: GRAPHQL_PLUGIN_CONFIG, bootstrapService: BootstrapService);
    OnInit(): void;
    register(): void;
    handler(request: any, h: any): Promise<any>;
}
