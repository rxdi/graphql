import { Observable } from 'rxjs';
interface ResolverContext {
}
interface CanActivateResolver {
    resolve(context: any): boolean | Promise<boolean> | Observable<boolean>;
}
export declare class AuthGuard implements CanActivateResolver {
    resolve(context: ResolverContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
