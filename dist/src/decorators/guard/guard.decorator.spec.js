"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const core_1 = require("@rxdi/core");
const guard_decorator_1 = require("./guard.decorator");
let AuthGuard = class AuthGuard {
    canActivate(context, payload, descriptor) {
        return context;
    }
};
AuthGuard = __decorate([
    core_1.Service()
], AuthGuard);
exports.AuthGuard = AuthGuard;
describe('Decorators: @Guard', () => {
    it('Should decorate findUser to have guard', (done) => {
        let TestController = class TestController {
            findUser() {
                return 1;
            }
        };
        __decorate([
            guard_decorator_1.Guard(AuthGuard),
            index_1.Query(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestController.prototype, "findUser", null);
        TestController = __decorate([
            core_1.Controller()
        ], TestController);
        const query = core_1.Container.get(TestController);
        const currentGuard = core_1.Container.get(query.findUser().guards[0]);
        expect(query.findUser().guards[0]['metadata']['moduleHash']).toBe(AuthGuard['metadata']['moduleHash']);
        expect(currentGuard.canActivate).toBeDefined();
        expect(currentGuard.canActivate(false)).toBeFalsy();
        done();
    });
});
describe('Decorators: @Guard', () => {
    it('Should decorate findUser to have guard and to check if conditions', (done) => {
        let AuthGuard = class AuthGuard {
            canActivate(context, payload, descriptor) {
                if (payload === 'test') {
                    return true;
                }
            }
        };
        AuthGuard = __decorate([
            core_1.Service()
        ], AuthGuard);
        let TestController = class TestController {
            findUser() {
                return 1;
            }
        };
        __decorate([
            guard_decorator_1.Guard(AuthGuard),
            index_1.Query(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestController.prototype, "findUser", null);
        TestController = __decorate([
            core_1.Controller()
        ], TestController);
        const controller = core_1.Container.get(TestController);
        const currentGuard = core_1.Container.get(controller.findUser().guards[0]);
        const descriptor = controller.findUser();
        expect(controller.findUser().guards[0]['metadata']['moduleHash']).toBe(AuthGuard['metadata']['moduleHash']);
        expect(currentGuard.canActivate).toBeDefined();
        expect(currentGuard.canActivate(null, 'test')).toBeTruthy();
        expect(currentGuard.canActivate(null, 'no-test')).toBeFalsy();
        done();
    });
});
