import { GraphQLObjectType, GraphQLNonNull } from 'graphql';
export interface GenericGapiResolversType {
    scope?: string[];
    target?: any;
    effect?: string;
    guards?: Function[];
    method_name?: string;
    subscribe?: () => {};
    method_type?: 'query' | 'subscription' | 'mutation' | 'event';
    type: GraphQLObjectType;
    resolve?(root: any, args: Object, context: any): any;
    args?: {
        [key: string]: {
            [type: string]: GraphQLObjectType | GraphQLNonNull<any>;
        };
    };
}
export declare function Query<T>(options?: any): (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
