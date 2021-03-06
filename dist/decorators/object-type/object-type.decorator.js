"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function GapiObjectType(options) {
    return function (target, propertyName, index) {
        const userTypes = new target();
        const type = Object.create({ fields: {}, name: target.name });
        Object.keys(userTypes).forEach(field => (type.fields[field] = { type: userTypes[field] }));
        if (target.prototype._metadata && target.prototype._metadata.length) {
            target.prototype._metadata.forEach(meta => (type.fields[meta.key].resolve = meta.resolve.bind(target.prototype)));
        }
        if (options && options.raw) {
            return target;
        }
        else {
            return function () {
                return options && options.input
                    ? new graphql_1.GraphQLInputObjectType(type)
                    : new graphql_1.GraphQLObjectType(type);
            };
        }
    };
}
exports.GapiObjectType = GapiObjectType;
