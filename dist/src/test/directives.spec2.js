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
require("jest");
const core_1 = require("@rxdi/core");
const plugin_init_1 = require("../plugin-init");
const core_module_1 = require("./helpers/core-module");
const graphql_1 = require("graphql");
const operators_1 = require("rxjs/operators");
const decorators_1 = require("../decorators");
const UserType = new graphql_1.GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: {
            type: graphql_1.GraphQLInt,
            resolve: () => {
                return 2;
            }
        }
    })
});
let UserQueriesController = class UserQueriesController {
    findUser(root, { id }, context) {
        return { id: id };
    }
};
__decorate([
    decorators_1.Type(UserType),
    decorators_1.Query({
        id: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UserQueriesController.prototype, "findUser", null);
UserQueriesController = __decorate([
    core_1.Controller()
], UserQueriesController);
describe('Global Server Tests', () => {
    let pluginInit;
    let schema;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield core_1.createTestBed({ controllers: [UserQueriesController] })
            .pipe(operators_1.switchMapTo(core_module_1.startServer())).toPromise();
        pluginInit = core_1.Container.get(plugin_init_1.PluginInit);
        schema = yield core_module_1.getGraphqlSchema().toPromise();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () { return yield core_module_1.stopServer(); }));
    it('Should create query to test resolvers', (done) => __awaiter(this, void 0, void 0, function* () {
        const res = yield pluginInit.sendRequest({
            query: `query findUser($id: Int!) { findUser(id: $id) { id } }`,
            variables: { id: 1 }
        });
        expect(res.data.findUser.id).toBe(2);
        done();
    }));
    it('Should check for plugin init query', (done) => __awaiter(this, void 0, void 0, function* () {
        const res = yield pluginInit.sendRequest({
            query: `query { status { status } }`,
            variables: { id: 1 }
        });
        expect(res.data.status.status).toBe('200');
        done();
    }));
    it('Should check if findUser type has id and resolver defined', (done) => __awaiter(this, void 0, void 0, function* () {
        expect(schema.getQueryType().getFields().findUser.type['getFields']().id.resolve).toBeDefined();
        expect(schema.getQueryType().getFields().findUser).toBeDefined();
        done();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () { return yield core_module_1.stopServer(); }));
});
