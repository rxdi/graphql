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
const core_1 = require("@rxdi/core");
const of_type_decorator_1 = require("./of-type.decorator");
const object_type_1 = require("../object-type");
const graphql_1 = require("graphql");
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
const GapiEffects = strEnum([
    'findUser'
]);
let UserEffectsService = class UserEffectsService {
    findUser(args, context, info) {
        console.log(args, context);
    }
};
__decorate([
    of_type_decorator_1.OfType(GapiEffects.findUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UserEffectsService.prototype, "findUser", null);
UserEffectsService = __decorate([
    core_1.Service()
], UserEffectsService);
let UserType = class UserType {
    constructor() {
        this.id = graphql_1.GraphQLInt;
    }
};
UserType = __decorate([
    object_type_1.GapiObjectType()
], UserType);
class TestingMutation {
}
core_1.Container.get(UserEffectsService);
describe('Decorators: @OfType', () => {
    it('Should emit effect based on resolved resolver', (done) => {
        // const mutation: TestingMutation = <any>Container.get(ClassTestProvider).mutation(null, {id: null}, null);
        done();
    });
});
