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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const graphql_1 = require("graphql");
const core_1 = require("@rxdi/core");
const hapi_1 = require("@rxdi/hapi");
const index_2 = require("../../index");
const config_tokens_1 = require("../../config.tokens");
const services_1 = require("../../services");
const rxjs_1 = require("rxjs");
let UserType = class UserType {
    constructor() {
        this.id = graphql_1.GraphQLInt;
    }
};
UserType = __decorate([
    index_1.GapiObjectType()
], UserType);
let TestInjectable = class TestInjectable {
    constructor() {
        this.pesho = 'pesho';
    }
};
TestInjectable = __decorate([
    core_1.Service()
], TestInjectable);
let ClassTestProvider = class ClassTestProvider {
    constructor(injecatble) {
        this.injecatble = injecatble;
    }
    findUser(root, { id }, context) {
        return { id: 1 };
    }
    testInjection() {
        return rxjs_1.of(this.injecatble.pesho);
    }
};
__decorate([
    index_1.Scope('ADMIN'),
    index_1.Type(UserType),
    index_1.Query({
        id: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ClassTestProvider.prototype, "findUser", null);
__decorate([
    index_1.Scope('ADMIN'),
    index_1.Type(UserType),
    index_1.Query({
        id: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassTestProvider.prototype, "testInjection", null);
ClassTestProvider = __decorate([
    core_1.Controller(),
    __metadata("design:paramtypes", [TestInjectable])
], ClassTestProvider);
class TestingQuery {
}
const DEFAULT_CONFIG = {
    server: {
        hapi: {
            port: 9000
        },
    },
    graphql: {
        path: '/graphql',
        openBrowser: false,
        writeEffects: false,
        graphiql: false,
        graphiQlPlayground: false,
        graphiQlPath: '/graphiql',
        watcherPort: '',
        graphiqlOptions: {
            endpointURL: '/graphql',
            subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${process.env.DEPLOY_PLATFORM === 'heroku'
                ? ''
                : `:${process.env.API_PORT ||
                    process.env.PORT || 9000}`}/subscriptions`,
            websocketConnectionParams: {
                token: process.env.GRAPHIQL_TOKEN
            }
        },
        graphqlOptions: {
            schema: null
        }
    },
};
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    core_1.Module({
        imports: [
            hapi_1.HapiModule.forRoot(DEFAULT_CONFIG.server),
            index_2.GraphQLModule.forRoot(DEFAULT_CONFIG.graphql),
        ]
    })
], CoreModule);
exports.CoreModule = CoreModule;
beforeAll((done) => {
    core_1.Container.get(CoreModule);
    done();
});
describe('Decorators: @Query', () => {
    it('Should decorate target descriptor with appropriate values', (done) => {
        const query = core_1.Container.get(ClassTestProvider).findUser(null, { id: null }, null);
        expect(JSON.stringify(query.args.id.type)).toBe(JSON.stringify(new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)));
        expect(query.method_name).toBe('findUser');
        expect(query.method_type).toBe('query');
        expect(query.type.name).toBe('UserType');
        expect(query.scope[0]).toBe('ADMIN');
        const returnResult = query.resolve(null, {}, null);
        expect(returnResult.id).toBe(1);
        done();
    });
    it('Should decorate testInjection to have this from ClassTestProvider', (done) => __awaiter(this, void 0, void 0, function* () {
        core_1.Container.get(services_1.ApolloService);
        const queryFields = core_1.Container.get(config_tokens_1.GRAPHQL_PLUGIN_CONFIG).graphqlOptions.schema.getQueryType().getFields();
        const resolver = queryFields.testInjection.resolve.bind(queryFields.testInjection['target']);
        expect(queryFields.testInjection['method_name']).toBe('testInjection');
        expect(yield resolver()).toBe('pesho');
        done();
    }));
});
