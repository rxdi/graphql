import { Query, CanActivateResolver, ResolverContext, GenericGapiResolversType, InterceptResolver } from '../index';
import { Container, Controller, Service } from '@rxdi/core';
import { Interceptor } from './intercept.decorator';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Service()
export class LoggerInterceptor implements InterceptResolver {
    intercept(
        chainable$: Observable<any>,
        payload,
        context,
        descriptor: GenericGapiResolversType
    ) {
        console.log('Before...');
        const now = Date.now();
        return chainable$.pipe(
            tap(() => console.log(`After... ${Date.now() - now}ms`)),
        );
    }
}

describe('Decorators: @Interceptor', () => {
    it('Should decorate findUser to have interceptor', (done) => {

        @Controller()
        class TestController {
            @Interceptor(LoggerInterceptor)
            @Query()
            findUser() {
                return 1;
            }
        }
        const query: { findUser(): GenericGapiResolversType } = <any>Container.get(TestController);
        const currentGuard = Container.get<InterceptResolver>(query.findUser().interceptor);
        expect(query.findUser().interceptor['metadata']['moduleHash']).toBe(LoggerInterceptor['metadata']['moduleHash']);
        expect(currentGuard.intercept).toBeDefined();
        expect(currentGuard.intercept(of(true), {}, {}, query.findUser())).toBeInstanceOf(Observable);
        done();
    });
});
