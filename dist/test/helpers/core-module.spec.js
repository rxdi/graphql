"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_module_1 = require("./core-module");
describe('Core module helper', () => {
    it('Should set appropriate config to graphql', (done) => __awaiter(this, void 0, void 0, function* () {
        expect(core_module_1.setConfigGraphql({ initQuery: false }).initQuery).toBe(false);
        expect(core_module_1.setConfigGraphql({ writeEffects: true }).writeEffects).toBe(true);
        expect(core_module_1.setConfigGraphql({ buildAstDefinitions: false }).buildAstDefinitions).toBe(false);
        done();
    }));
    it('Should set appropriate config to server', (done) => __awaiter(this, void 0, void 0, function* () {
        expect(core_module_1.setConfigServer({ randomPort: false }).randomPort).toBe(false);
        expect(core_module_1.setConfigServer({ hapi: { port: 9202 } }).hapi.port).toBe(9202);
        done();
    }));
});
