import { Observable } from 'rxjs';
export interface ResolverContext {
}
export interface CanActivateResolver {
    canActivate(context: ResolverContext): boolean | Promise<boolean> | Observable<boolean>;
}
