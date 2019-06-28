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
const intercept_decorator_1 = require("./intercept.decorator");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
describe('Decorators: @Interceptor', () => {
    it('Should decorate findUser to have interceptor', (done) => {
        let LoggerInterceptor = class LoggerInterceptor {
            intercept(chainable$, payload, context, descriptor) {
                console.log('Before...');
                const now = Date.now();
                return chainable$.pipe(operators_1.tap(() => console.log(`After... ${Date.now() - now}ms`)));
            }
        };
        LoggerInterceptor = __decorate([
            core_1.Service()
        ], LoggerInterceptor);
        let TestController = class TestController {
            findUser() {
                return 1;
            }
        };
        __decorate([
            intercept_decorator_1.Interceptor(LoggerInterceptor),
            index_1.Query(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestController.prototype, "findUser", null);
        TestController = __decorate([
            core_1.Controller()
        ], TestController);
        const query = core_1.Container.get(TestController);
        const currentGuard = core_1.Container.get(query.findUser().interceptor);
        expect(query.findUser().interceptor['metadata']['moduleHash']).toBe(LoggerInterceptor['metadata']['moduleHash']);
        expect(currentGuard.intercept).toBeDefined();
        expect(currentGuard.intercept(rxjs_1.of(true), {}, {}, query.findUser())).toBeInstanceOf(rxjs_1.Observable);
        done();
    });
    it('Should decorate findUser to have interceptor and will correctly pass payload and context arguments', (done) => {
        let LoggerInterceptor = class LoggerInterceptor {
            intercept(chainable$, payload, context, descriptor) {
                console.log('Before...');
                const now = Date.now();
                return chainable$.pipe(operators_1.map((res) => ({ payload, context })));
            }
        };
        LoggerInterceptor = __decorate([
            core_1.Service()
        ], LoggerInterceptor);
        let TestController = class TestController {
            findUser() {
                return 1;
            }
        };
        __decorate([
            intercept_decorator_1.Interceptor(LoggerInterceptor),
            index_1.Query(),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestController.prototype, "findUser", null);
        TestController = __decorate([
            core_1.Controller()
        ], TestController);
        const query = core_1.Container.get(TestController);
        const currentGuard = core_1.Container.get(query.findUser().interceptor);
        expect(query.findUser().interceptor['metadata']['moduleHash']).toBe(LoggerInterceptor['metadata']['moduleHash']);
        expect(currentGuard.intercept).toBeDefined();
        expect(currentGuard.intercept(rxjs_1.of(true), {}, {}, query.findUser())).toBeInstanceOf(rxjs_1.Observable);
        const observable = currentGuard.intercept(rxjs_1.of(true), 1, 2, query.findUser());
        observable.subscribe(res => {
            expect(res).toEqual({ payload: 1, context: 2 });
            done();
        });
    });
});
