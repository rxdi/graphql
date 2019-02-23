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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const config_tokens_1 = require("../config.tokens");
const bootstrap_service_1 = require("./bootstrap.service");
let HookService = class HookService {
    constructor(config) {
        this.config = config;
    }
    AttachHooks(graphQLFields) {
        graphQLFields.forEach(type => {
            if (!type) {
                return;
            }
            const resolvers = type.getFields();
            Object.keys(resolvers).forEach(resolver => {
                resolvers[resolver]['scope'] = resolvers[resolver]['scope'] || [process.env.APP_DEFAULT_SCOPE || 'ADMIN'];
                if (!resolvers[resolver]['public']) {
                    this.AddHooks(resolvers[resolver]);
                }
                this.bootstrap.applyMetaToResolvers(resolvers[resolver], resolvers[resolver]['self']);
            });
        });
    }
    canAccess(resolverScope, context) {
        return context && context.user && resolverScope.filter(scope => scope === context.user.type).length ? true : error_service_1.errorUnauthorized();
    }
    AuthenticationHooks(resolver, context) {
        this.canAccess(resolver['scope'], context);
    }
    ResolverHooks(resolver, root, args, context, info) {
        this.AuthenticationHooks(resolver, context);
    }
    AddHooks(resolver) {
        if (this.config.authentication) {
            const resolve = resolver.resolve;
            const self = this;
            resolver.resolve = function (root, args, context, info, ...a) {
                return __awaiter(this, void 0, void 0, function* () {
                    self.ResolverHooks(resolver, root, args, context, info);
                    return yield resolve(root, args, context, info, ...a);
                });
            };
        }
    }
};
__decorate([
    core_1.Inject(() => bootstrap_service_1.BootstrapService),
    __metadata("design:type", bootstrap_service_1.BootstrapService)
], HookService.prototype, "bootstrap", void 0);
HookService = __decorate([
    core_1.Service(),
    __param(0, core_1.Inject(config_tokens_1.GRAPHQL_PLUGIN_CONFIG)),
    __metadata("design:paramtypes", [Object])
], HookService);
exports.HookService = HookService;
