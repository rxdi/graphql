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
const core_1 = require("@rxdi/core");
const Boom = require("boom");
const hapi_1 = require("hapi");
const apollo_server_core_1 = require("apollo-server-core");
const hapi_2 = require("@rxdi/hapi");
const config_tokens_1 = require("../config.tokens");
// import { AuthService } from '../auth/auth.service';
// import { Container } from '../../container';
const bootstrap_service_1 = require("../services/bootstrap.service");
let ApolloService = class ApolloService {
    constructor(server, config, bootstrapService) {
        this.server = server;
        this.config = config;
        this.bootstrapService = bootstrapService;
    }
    OnInit() {
        let proxySchema;
        try {
            proxySchema = core_1.Container.get('gapi-custom-schema-definition');
        }
        catch (e) { }
        this.config.graphqlOptions.schema = proxySchema || this.config.graphqlOptions.schema || this.bootstrapService.generateSchema();
        this.register();
    }
    register() {
        if (!this.config || !this.config.graphqlOptions) {
            throw new Error('Apollo Server requires options.');
        }
        console.log('APOLLO PLUGIN REGISTER');
        this.server.route({
            method: ['GET', 'POST'],
            path: this.config.path || '/graphql',
            vhost: this.config.vhost || undefined,
            config: this.config.route || {},
            handler: this.handler.bind(this)
        });
    }
    handler(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (request.headers.authorization && request.headers.authorization !== 'undefined' && this.config.authentication) {
                    try {
                        const serviceUtilsService = core_1.Container.get(this.config.authentication);
                        this.config.graphqlOptions.context = yield serviceUtilsService.validateToken(request.headers.authorization);
                    }
                    catch (e) {
                        return Boom.unauthorized();
                    }
                }
                else {
                    this.config.graphqlOptions.context = null;
                }
                const gqlResponse = yield apollo_server_core_1.runHttpQuery([request], {
                    method: request.method.toUpperCase(),
                    options: this.config.graphqlOptions,
                    query: request.method === 'post' ? request.payload : request.query,
                });
                const response = h.response(gqlResponse);
                response.type('application/json');
                return response;
            }
            catch (error) {
                if ('HttpQueryError' !== error.name) {
                    throw Boom.boomify(error);
                }
                if (true === error.isGraphQLError) {
                    const response = h.response(error.message);
                    response.code(error.statusCode);
                    response.type('application/json');
                    return response;
                }
                const err = new Boom(error.message, { statusCode: error.statusCode });
                if (error.headers) {
                    Object.keys(error.headers).forEach(header => {
                        err.output.headers[header] = error.headers[header];
                    });
                }
                // Boom hides the error when status code is 500
                err.output.payload.message = error.message;
                throw err;
            }
        });
    }
};
ApolloService = __decorate([
    core_1.Service(),
    __param(0, core_1.Inject(hapi_2.HAPI_SERVER)),
    __param(1, core_1.Inject(config_tokens_1.GRAPHQL_PLUGIN_CONFIG)),
    __metadata("design:paramtypes", [hapi_1.Server, Object, bootstrap_service_1.BootstrapService])
], ApolloService);
exports.ApolloService = ApolloService;
