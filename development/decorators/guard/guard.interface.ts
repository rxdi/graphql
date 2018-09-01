import { Observable } from 'rxjs';
import { GenericGapiResolversType } from '../query';

export interface ResolverContext {}

export interface CanActivateResolver {
    canActivate(
        context: ResolverContext,
        descriptor: GenericGapiResolversType
    ): boolean | Promise<boolean> | Observable<boolean>;
}


export interface GraphQLControllerOptions {
    guards?: Function[];
    type?: any;
    scope?: string[];
}