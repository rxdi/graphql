import { Service, BootstrapLogger, Inject, AfterStarterService } from "@rxdi/core";
import { HAPI_SERVER, OpenService } from "@rxdi/hapi";
import { Server } from "hapi";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";

@Service()
export class StartService {

    constructor(
        @Inject(HAPI_SERVER) private server: Server,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG,
        private logger: BootstrapLogger,
        private afterStarterService: AfterStarterService,
        private openService: OpenService
    ) { }

    OnInit() {
        this.afterStarterService.appStarted.subscribe(() => {
            if (this.config.openBrowser) {
                this.openService.openGraphQLPage();
                this.logger.log('Browser started!');
            }
        })
    }

}