import { Scope, Type, GapiObjectType, Query } from '../index';
import { GraphQLInt, GraphQLScalarType, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Container, Service } from '@rxdi/core';
import 'jest';

@GapiObjectType()
class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    name: string;
}


@Service()
class TestInjectable {
    pesho: string = 'pesho';
}

@Service()
class ClassTestProvider {
    constructor(
        private injecatble: TestInjectable
    ) {}
    @Scope('ADMIN')
    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context) {
        return {id: 1};
    }
    @Scope('ADMIN')
    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    testInjection(root, { id }, context) {
        return this.injecatble.pesho;
    }
}


class TestingQuery {
    resolve: <T>(root, payload, context) => T;
    args: {[key: string]: {type: any}};
    method_type: string;
    method_name: string;
    target: ClassTestProvider;
    type: UserType;
    scope: Array<string>;
}


describe('Decorators: @Query', () => {
    it('Should decorate target descriptor with appropriate values', (done) => {
        const query: TestingQuery = <any>Container.get(ClassTestProvider).findUser(null, {id: null}, null);
        expect(JSON.stringify(query.args.id.type)).toBe(JSON.stringify(new GraphQLNonNull(GraphQLInt)));
        expect(query.method_name).toBe('findUser');
        expect(query.method_type).toBe('query');
        expect(query.type.name).toBe('UserType');
        expect(query.scope[0]).toBe('ADMIN');
        const returnResult: {id: number} = query.resolve(null, {}, null);
        expect(returnResult.id).toBe(1);
        done();
    });
});

describe('Decorators: @Query', () => {
    it('Should decorate testInjection to have this from ClassTestProvider', (done) => {
        const provider = Container.get(ClassTestProvider);
        const query: TestingQuery = <any>provider.testInjection(null, {id: null}, null);
        expect(JSON.stringify(query.args.id.type)).toBe(JSON.stringify(new GraphQLNonNull(GraphQLInt)));
        expect(query.method_name).toBe('testInjection');
        const returnResult: {id: number} = query.resolve.bind(provider)(null, {}, null);
        expect(returnResult).toBe('pesho');
        done();
    });
});
