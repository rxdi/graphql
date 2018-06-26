import { PluginInterface, BootstrapLogger } from "@rxdi/core";
import { Server } from "hapi";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
export declare class StartService implements PluginInterface {
    private logger;
    private server;
    private config;
    constructor(logger: BootstrapLogger, server: Server, config: GRAPHQL_PLUGIN_CONFIG);
    OnInit(): void;
    register(): Promise<void>;
}
