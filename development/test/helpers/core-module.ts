import { GRAPHQL_PLUGIN_CONFIG, SCHEMA_OVERRIDE } from '../../config.tokens';
import { HapiConfigModel, HapiModule } from '@rxdi/hapi';
import { GraphQLModule } from '../..';
import { Module, ModuleWithServices, Controller, Container } from '@rxdi/core';
import { Type, Query } from '../../../development/decorators';
import { GraphQLNonNull, GraphQLInt, GraphQLObjectType } from 'graphql';

export interface CoreModuleConfig {
    server?: HapiConfigModel;
    graphql?: GRAPHQL_PLUGIN_CONFIG;
}

const DEFAULT_CONFIG = {
    server: {
        randomPort: true,
        hapi: {
            port: 9000
        },
    },
    graphql: {
        path: '/graphql',
        initQuery: true,
        buildAstDefinitions: false,
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

@Module({
    controllers: [UserQueriesController]
})
class AppModule { }


@Module()
class CoreModule {}

export const createTestBed = () => {
    Container.get(<any>HapiModule.forRoot(DEFAULT_CONFIG.server));
    Container.get(<any>GraphQLModule.forRoot(DEFAULT_CONFIG.graphql));
    return CoreModule;
};


export const createAppModule = () => {
    return AppModule;
};


