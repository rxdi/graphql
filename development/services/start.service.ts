import { Service, PluginInterface, BootstrapLogger, Inject } from "@rxdi/core";
import { HAPI_SERVER } from "@rxdi/hapi";
import { Server } from "hapi";
import opn = require('opn');
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";

@Service()
export class StartService implements PluginInterface {

    constructor(
        private logger: BootstrapLogger,
        @Inject(HAPI_SERVER) private server: Server,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG
    ) { }

    OnInit() {
        if (this.config.openBrowser) {
            console.log("Browser started");
            this.register();
        }
    }

    async register() {
        await opn(`http://${this.server.info.address}:${this.server.info.port}/graphiql`);
    }
}