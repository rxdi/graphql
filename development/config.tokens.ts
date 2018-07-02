import { InjectionToken } from "@rxdi/core";
import * as GraphiQL from 'apollo-server-module-graphiql';

import {
    GraphQLOptions,
    runHttpQuery,
    HttpQueryError,
} from 'apollo-server-core';

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
    path: string;
    graphiQlPath?: string;
    writeEffects?: boolean;
    openBrowser?: boolean;
    authentication?: Function | InjectionToken<any>;
    vhost?: string;
    route?: {
        cors?: boolean
    };
    graphqlOptions: GraphQLOptions;
    graphiqlOptions: GraphiQL.GraphiQLData;
}
export interface GRAPHQL_AUTHENTICATION_FAKE {
    validateToken(authorization: string): any;
    onSubConnection(connectionParams): any;
    onSubOperation(connectionParams, params, webSocket): any
};


export const GRAPHQL_PLUGIN_CONFIG = new InjectionToken<GRAPHQL_PLUGIN_CONFIG>('graphql-configuration-injection-token');