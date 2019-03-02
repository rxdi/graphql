import { Module, ModuleWithServices } from '@rxdi/core';
import { HookService, EffectService, ServerPushPlugin } from './services';
import { ApolloService } from './services/apollo.service';
import { GRAPHQL_PLUGIN_CONFIG } from './config.tokens';
import { BootstrapService } from './services/bootstrap.service';
import { GraphiQLService } from './services/graphiql.service';
import { StartService } from './services/start.service';
import { PlaygroundModule } from '@gapi/playground';
import { PluginInit } from './plugin-init';

@Module({
    services: [
        HookService,
        BootstrapService,
        ApolloService,
        GraphiQLService,
        StartService
    ],
    plugins: [ServerPushPlugin, PluginInit]
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
            ],
            frameworkImports: [
                PlaygroundModule.forRoot({
                    path: config.graphiQlPath || '/graphiql',
                    endpoint: config.path || '/graphql',
                    version: '1.7.1',
                    graphiqlPlayground: config.graphiQlPlayground
                }),
            ]
        };
    }
}

export * from './decorators';
export * from './services';
export * from './config.tokens';