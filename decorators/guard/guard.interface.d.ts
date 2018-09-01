import { Observable } from 'rxjs';
import { GenericGapiResolversType } from '../query';
export interface ResolverContext {
}
export interface CanActivateResolver {
    canActivate(context: ResolverContext, payload?: any, descriptor?: GenericGapiResolversType): boolean | Promise<boolean> | Observable<boolean>;
}
export interface GraphQLControllerOptions {
    guards?: any[];
    type?: any;
    scope?: string[];
}
