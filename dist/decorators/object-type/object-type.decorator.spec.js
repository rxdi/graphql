"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const graphql_1 = require("graphql");
const core_1 = require("@rxdi/core");
let TestType = class TestType {
    constructor() {
        this.value = graphql_1.GraphQLInt;
    }
};
TestType = __decorate([
    index_1.GapiObjectType()
], TestType);
let UserType = class UserType {
    constructor() {
        this.id = graphql_1.GraphQLInt;
        this.name = graphql_1.GraphQLString;
        this.testType = index_1.InjectType(TestType);
    }
};
UserType = __decorate([
    index_1.GapiObjectType()
], UserType);
describe('Decorators: @GapiObjectType', () => {
    it('Should decorate Class to be UserType with prototype GraphQLObjectType', (done) => {
        expect(graphql_1.GraphQLObjectType.name).toBe(core_1.Container.get(UserType).constructor.name);
        done();
    });
    it('Should get raw object value ', (done) => {
        let UserType2 = class UserType2 {
            constructor() {
                this.id = graphql_1.GraphQLInt;
                this.name = graphql_1.GraphQLString;
                this.testType = index_1.InjectType(TestType);
            }
        };
        UserType2 = __decorate([
            index_1.GapiObjectType({ raw: true, input: false })
        ], UserType2);
        const mutation = core_1.Container.get(UserType2);
        expect(JSON.stringify(mutation.id)).toBe(JSON.stringify(graphql_1.GraphQLInt));
        expect(JSON.stringify(mutation.name)).toBe(JSON.stringify(graphql_1.GraphQLString));
        expect(`${mutation.testType}`).toBe(`${core_1.Container.get(TestType)}`);
        done();
    });
});
