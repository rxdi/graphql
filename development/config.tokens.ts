import { InjectionToken } from '@rxdi/core';
import * as GraphiQL from 'apollo-server-module-graphiql';

import {
    GraphQLOptions,
    runHttpQuery,
    HttpQueryError,
} from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { Server } from 'hapi';

export interface HapiOptionsFunction {
    (req?: Request): GraphQLOptions | Promise<GraphQLOptions>;
}

export interface HapiGraphiQLOptionsFunction {
    (req?: Request): GraphiQL.GraphiQLData | Promise<GraphiQL.GraphiQLData>;
}

export interface HapiGraphiQLPluginOptions {
    path: string;
    route?: any;
    graphiqlOptions: GraphiQL.GraphiQLData | HapiGraphiQLOptionsFunction;
}

export interface GRAPHQL_PLUGIN_CONFIG {
    path?: string;
    graphiQlPlayground?: boolean;
    graphiql?: boolean;
    graphiQlPath?: string;
    writeEffects?: boolean;
    openBrowser?: boolean;
    watcherPort?: string | number;
    authentication?: Function | InjectionToken<any>;
    vhost?: string;
    route?: {
        cors?: boolean;
    };
    graphqlOptions?: GraphQLOptions;
    graphiqlOptions?: GraphiQL.GraphiQLData;
}
export interface GRAPHQL_AUTHENTICATION_FAKE {
    validateToken(authorization: string): any;
    onSubConnection(connectionParams): any;
    onSubOperation(connectionParams, params, webSocket): any;
}

export const GRAPHQL_PLUGIN_CONFIG = new InjectionToken<GRAPHQL_PLUGIN_CONFIG>('graphql-configuration-injection-token');

export interface Neo4JInjectionInterface {
    makeAugmentedSchema(options: { typeDefs: string }): GraphQLSchema;
    augmentSchema(schema): GraphQLSchema;
}

export interface IRegister {
    (server: Server, options: any): void;
}

export interface IPlugin {
    name: string;
    version?: string;
    register: IRegister;
}