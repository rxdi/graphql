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
const graphql_1 = require("graphql");
const core_1 = require("@rxdi/core");
jest.useFakeTimers();
let UserType = class UserType {
    constructor() {
        this.id = graphql_1.GraphQLInt;
    }
};
UserType = __decorate([
    index_1.GapiObjectType()
], UserType);
let ClassTestProvider = class ClassTestProvider {
    mutation(root, { id }, context) {
        return { id: 1 };
    }
};
__decorate([
    index_1.Scope('ADMIN'),
    index_1.Type(UserType),
    index_1.Mutation({
        id: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ClassTestProvider.prototype, "mutation", null);
ClassTestProvider = __decorate([
    core_1.Controller()
], ClassTestProvider);
class TestingMutation {
}
describe('Decorators: @Mutation', () => {
    it('Should decorate target descriptor with appropriate values', (done) => {
        const mutation = core_1.Container.get(ClassTestProvider).mutation(null, { id: null }, null);
        expect(JSON.stringify(mutation.args.id.type)).toBe(JSON.stringify(new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)));
        expect(mutation.method_name).toBe('mutation');
        expect(mutation.method_type).toBe('mutation');
        expect(core_1.Container.get(ClassTestProvider)).toBeInstanceOf(ClassTestProvider);
        expect(mutation.type).toBeInstanceOf(graphql_1.GraphQLObjectType);
        expect(mutation.type.name).toBe('UserType');
        expect(mutation.scope[0]).toBe('ADMIN');
        const returnResult = mutation.resolve(null, {}, null);
        expect(returnResult.id).toBe(1);
        done();
    });
});
