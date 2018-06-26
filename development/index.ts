import { Module, ModuleWithServices } from "@rxdi/core";
import { HookService, SchemaService, EffectService } from './services';
import { ApolloService } from './services/apollo.service';
import { GRAPHQL_PLUGIN_CONFIG } from './config.tokens';
import { BootstrapService } from "./services/bootstrap.service";
import { GraphiQLService } from './services/graphiql.service';
import { StartService } from './services/start.service';

@Module({
    services: [
        BootstrapService,
        ApolloService,
        GraphiQLService,
        StartService
    ]
})
export class GraphQLModule {
    public static forRoot(config: GRAPHQL_PLUGIN_CONFIG): ModuleWithServices {
        return {
            module: GraphQLModule,
            services: [
                EffectService,
                { 
                    provide: GRAPHQL_PLUGIN_CONFIG,
                    useValue: config
                },
                HookService,
                SchemaService
            ]
        }
    }
}

export * from './decorators';
export * from './services';
export * from './config.tokens';