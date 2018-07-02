import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
export declare class HookService {
    private config;
    constructor(config: GRAPHQL_PLUGIN_CONFIG);
    AttachHooks(graphQLFields: any): void;
    canAccess(routeScope: any, context: any): true | void;
    AuthenticationHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    ResolverHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    AddHooks(resolver: any): void;
}
