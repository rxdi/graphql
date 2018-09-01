import { Observable } from 'rxjs';
import { GenericGapiResolversType } from '../query/query.decorator';

export interface InterceptResolver {
    intercept(chainable: Observable<any>, payload, context, desc: GenericGapiResolversType);
}

