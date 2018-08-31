import { Query, CanActivateResolver, ResolverContext } from '../index';
import { Container, Controller, Service } from '@rxdi/core';
import { Guard } from './guard.decorator';
import { Observable } from 'rxjs';

@Service()
export class AuthGuard implements CanActivateResolver {

    canActivate(
        context: boolean,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return context;
    }
}

describe('Decorators: @Guard', () => {
    it('Should decorate findUser to have guard', (done) => {

        @Controller()
        class TestController {
            @Guard(AuthGuard)
            @Query()
            findUser() {
                return 1;
            }
        }
        const query: { findUser(): { guards: Function[] } } = <any>Container.get(TestController);
        const currentGuard = Container.get<CanActivateResolver>(query.findUser().guards[0]);
        expect(query.findUser().guards[0]['metadata']['moduleHash']).toBe(AuthGuard['metadata']['moduleHash']);
        expect(currentGuard.canActivate).toBeDefined();
        expect(currentGuard.canActivate(false)).toBeFalsy();
        done();
    });
});
