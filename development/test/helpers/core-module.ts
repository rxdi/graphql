import { GRAPHQL_PLUGIN_CONFIG } from '../../config.tokens';
import { HapiConfigModel, HapiModule } from '@rxdi/hapi';
import { GraphQLModule } from '../..';
import { Module, Controller, Container, Bootstrap, BootstrapFramework, ModuleService, ModuleArguments, ConfigModel } from '@rxdi/core';
import { Type, Query } from '../../../development/decorators';
import { GraphQLNonNull, GraphQLInt, GraphQLObjectType } from 'graphql';
import { BootstrapService } from '@rxdi/core/services/bootstrap/bootstrap.service';

export interface CoreModuleConfig {
    server?: HapiConfigModel;
    graphql?: GRAPHQL_PLUGIN_CONFIG;
}

export const DEFAULT_CONFIG = {
    server: {
        randomPort: true,
        hapi: {
            port: 9000
        },
    },
    graphql: {
        path: '/graphql',
        initQuery: true,
        buildAstDefinitions: true,
        openBrowser: false,
        writeEffects: false,
        graphiql: false,
        graphiQlPlayground: false,
        graphiQlPath: '/graphiql',
        watcherPort: '',
        graphiqlOptions: {
            endpointURL: '/graphql',
            subscriptionsEndpoint: `${
                process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'
                }://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${
                process.env.DEPLOY_PLATFORM === 'heroku'
                    ? ''
                    : `:${process.env.API_PORT ||
                    process.env.PORT || 9000}`
                }/subscriptions`,
            websocketConnectionParams: {
                token: process.env.GRAPHIQL_TOKEN
            }
        },
        graphqlOptions: {
            schema: null
        }
    },
};




const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: () => {
                return 2;
            }
        }
    })
});

@Controller()
export class UserQueriesController {

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return { id: id };
    }

}


export const setConfigServer = (config: HapiConfigModel = {}) => {
    return { ...DEFAULT_CONFIG.server, ...config };
};

export const setConfigGraphql = (config: GRAPHQL_PLUGIN_CONFIG = {}) => {
    return { ...DEFAULT_CONFIG.graphql, ...config };
};


export const startServer = (config: CoreModuleConfig = {}, bootstrapOptions?: ConfigModel) => {
    return createTestBed({
        imports: [
            HapiModule.forRoot(setConfigServer(config.server)),
            GraphQLModule.forRoot(setConfigGraphql(config.graphql))
        ]
    }, [], bootstrapOptions);
};

export const createTestBed = <T, K>(options: ModuleArguments<T, K>, frameworks: any[] = [], bootstrapOptions?: ConfigModel) => {
    @Module({
        imports: options.imports || [],
        providers: options.providers || [],
        services: options.services || [],
        bootstrap: options.bootstrap || [],
        components: options.components || [],
        controllers: options.controllers || [],
        effects: options.effects || [],
        plugins: options.plugins || []
    })
    class AppModule { }
    return BootstrapFramework(AppModule, frameworks, bootstrapOptions);
};

export const setup = createTestBed;
