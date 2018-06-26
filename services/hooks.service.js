"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_service_1 = require("./error.service");
const core_1 = require("@rxdi/core");
function MakeError() {
    throw new error_service_1.createError('unauthorized', 'You are unable to fetch data');
}
let HookService = class HookService {
    AttachHooks(graphQLFields) {
        graphQLFields.forEach(type => {
            if (!type) {
                return;
            }
            const resolvers = type.getFields();
            Object.keys(resolvers).forEach(resolver => {
                resolvers[resolver].scope = resolvers[resolver].scope || [process.env.APP_DEFAULT_SCOPE || 'ADMIN'];
                if (!resolvers[resolver].public) {
                    this.AddHooks(resolvers[resolver]);
                }
            });
        });
    }
    canAccess(routeScope, context) {
        return context && routeScope.filter(scope => scope === context.type).length ? true : MakeError();
    }
    AuthenticationHooks(resolver, root, args, context, info) {
        this.canAccess(resolver.scope, context);
    }
    ResolverHooks(resolver, root, args, context, info) {
        this.AuthenticationHooks(resolver, root, args, context, info);
    }
    AddHooks(resolver) {
        // if (Container.get(ConfigService).cert) {
        const resolve = resolver.resolve;
        resolver.resolve = (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
            this.ResolverHooks(resolver, root, args, context, info);
            return yield resolve(root, args, context, info);
        });
        // }
    }
};
HookService = __decorate([
    core_1.Service()
], HookService);
exports.HookService = HookService;
