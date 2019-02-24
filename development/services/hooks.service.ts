import { errorUnauthorized } from './error.service';
import { Service, Inject } from '@rxdi/core';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { BootstrapService } from './bootstrap.service';
import { GraphQLObjectType, GraphQLField, GraphQLResolveInfo } from 'graphql';

@Service()
export class HookService {

    @Inject(() => BootstrapService) private bootstrap: BootstrapService;

    constructor(
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG
    ) {}

    AttachHooks(graphQLFields: GraphQLObjectType[]) {
        graphQLFields.forEach(type => {
            if (!type) {
                return;
            }
            const resolvers = type.getFields();
            Object.keys(resolvers).forEach(resolver => {
                const currentResolver = this.bootstrap.getResolverByName(resolvers[resolver]['name']);
                if (currentResolver) {
                    if (!resolvers[resolver]['public']) {
                        this.AddHooks(resolvers[resolver]);
                    }
                    resolvers[resolver].resolve = currentResolver.resolve;
                    resolvers[resolver]['target'] = currentResolver['target'];
                    resolvers[resolver]['interceptor'] = currentResolver['interceptor'];
                    resolvers[resolver]['scope'] = currentResolver['scope'] || [process.env.APP_DEFAULT_SCOPE || 'ADMIN'];
                    this.bootstrap.applyMetaToResolvers(<any>resolvers[resolver], resolvers[resolver]['target']);
                }
            });
        });
    }

    canAccess<K extends {user: {type: string}}>(resolverScope: string[], context: K) {
        return context && context.user && resolverScope.filter(scope => scope === context.user.type).length ? true : errorUnauthorized();
    }

    AuthenticationHooks<T, K>(resolver: GraphQLField<T, K>, context: K) {
        this.canAccess<any>(resolver['scope'], context);
    }

    ResolverHooks<T, K>(resolver: GraphQLField<T, K>, root: T, args: {[key: string]: any}, context: K, info: GraphQLResolveInfo) {
        this.AuthenticationHooks(resolver, context);
    }

    AddHooks<T, K>(resolver: GraphQLField<T, K>) {
        if (this.config.authentication) {
            const resolve = resolver.resolve;
            const self = this;
            resolver.resolve = function (root, args, context, info, ...a) {
                self.ResolverHooks(resolver, root, args, context, info);
                return resolve(root, args, context, info, ...a);
            };
        }
    }

}

