import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { GraphQLObjectType, GraphQLField, GraphQLResolveInfo } from 'graphql';
export declare class HookService {
    private config;
    private bootstrap;
    constructor(config: GRAPHQL_PLUGIN_CONFIG);
    AttachHooks(graphQLFields: GraphQLObjectType[]): void;
    canAccess<K extends {
        user: {
            type: string;
        };
    }>(resolverScope: string[], context: K): boolean;
    AuthenticationHooks<T, K>(resolver: GraphQLField<T, K>, context: K): void;
    ResolverHooks<T, K>(resolver: GraphQLField<T, K>, root: T, args: {
        [key: string]: any;
    }, context: K, info: GraphQLResolveInfo): void;
    AddHooks<T, K>(resolver: GraphQLField<T, K>): void;
}
