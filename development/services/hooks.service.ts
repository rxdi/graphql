import { createError } from './error.service';
import { Service, Inject } from '@rxdi/core';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';

function MakeError() {
    throw new createError('unauthorized', 'You are unable to fetch data');
}

@Service()
export class HookService {
    constructor(
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG
    ) {

    }
    AttachHooks(graphQLFields) {
        graphQLFields.forEach(type => {
            if (!type) {
                return;
            }
            const resolvers = type.getFields();
            Object.keys(resolvers).forEach(resolver => {
                resolvers[resolver].scope = resolvers[resolver].scope || [process.env.APP_DEFAULT_SCOPE || 'ADMIN'];
                if (!resolvers[resolver].public) {
                    this.AddHooks(resolvers[resolver]);
                }
            });
        });
    }

    canAccess(routeScope, context) {
        return context && context.user && routeScope.filter(scope => scope === context.user.type).length ? true : MakeError();
    }

    AuthenticationHooks(resolver, root, args, context, info) {
        this.canAccess(resolver.scope, context);
    }

    ResolverHooks(resolver, root, args, context, info) {
        this.AuthenticationHooks(resolver, root, args, context, info);
    }

    AddHooks(resolver) {
        if (this.config.authentication) {
            const resolve = resolver.resolve;
            resolver.resolve = async (root, args, context, info, ...a) => {
                this.ResolverHooks(resolver, root, args, context, info);
                return await resolve(root, args, context, info, ...a);
            };
        }
    }
}

