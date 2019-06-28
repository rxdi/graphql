import { CanActivateResolver } from '../index';
import { Observable } from 'rxjs';
export declare class AuthGuard implements CanActivateResolver {
    canActivate(context: boolean, payload: any, descriptor: any): boolean | Promise<boolean> | Observable<boolean>;
}
