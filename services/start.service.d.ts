import { BootstrapLogger, AfterStarterService } from "@rxdi/core";
import { OpenService } from "@rxdi/hapi";
import { Server } from "hapi";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
export declare class StartService {
    private server;
    private config;
    private logger;
    private afterStarterService;
    private openService;
    constructor(server: Server, config: GRAPHQL_PLUGIN_CONFIG, logger: BootstrapLogger, afterStarterService: AfterStarterService, openService: OpenService);
    OnInit(): void;
}
