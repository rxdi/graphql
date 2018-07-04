import { InjectionToken } from '@rxdi/core';
import * as GraphiQL from 'apollo-server-module-graphiql';
import { GraphQLOptions } from 'apollo-server-core';
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
    onSubConnection(connectionParams: any): any;
    onSubOperation(connectionParams: any, params: any, webSocket: any): any;
}
export declare const GRAPHQL_PLUGIN_CONFIG: InjectionToken<GRAPHQL_PLUGIN_CONFIG>;
