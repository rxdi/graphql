import { createError } from './error.service';
import { Service } from '@rxdi/core';

function MakeError() {
    throw new createError('unauthorized', 'You are unable to fetch data');
}

@Service()
export class HookService {

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
        return context && routeScope.filter(scope => scope === context.type).length ? true : MakeError();
    }

    AuthenticationHooks(resolver, root, args, context, info) {
        this.canAccess(resolver.scope, context);
    }

    ResolverHooks(resolver, root, args, context, info) {
        this.AuthenticationHooks(resolver, root, args, context, info);
    }

    AddHooks(resolver) {
        // if (Container.get(ConfigService).cert) {
        const resolve = resolver.resolve;
        resolver.resolve = async (root, args, context, info) => {
            this.ResolverHooks(resolver, root, args, context, info);
            return await resolve(root, args, context, info);
        };
        // }
    }
}

