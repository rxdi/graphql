export declare class HookService {
    AttachHooks(graphQLFields: any): void;
    canAccess(routeScope: any, context: any): true | void;
    AuthenticationHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    ResolverHooks(resolver: any, root: any, args: any, context: any, info: any): void;
    AddHooks(resolver: any): void;
}
