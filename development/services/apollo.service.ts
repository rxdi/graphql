import { Plugin, Service, Inject, PluginInterface } from "@rxdi/core";
import * as Boom from 'boom';
import { Server, Request } from 'hapi';
import * as GraphiQL from 'apollo-server-module-graphiql';
import {
    GraphQLOptions,
    runHttpQuery,
    HttpQueryError,
} from 'apollo-server-core';
import { HAPI_SERVER } from "@rxdi/hapi";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
// import { AuthService } from '../auth/auth.service';
// import { Container } from '../../container';
import { BootstrapService } from '../services/bootstrap.service';

export interface IRegister {
    (server: Server, options: any): void;
}

export interface IPlugin {
    name: string;
    version?: string;
    register: IRegister;
}

@Service()
export class ApolloService implements PluginInterface {

    constructor(
        @Inject(HAPI_SERVER) private server: Server,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG,
        private bootstrapService: BootstrapService
    ) { }

    OnInit() {
        this.config.graphqlOptions.schema = this.config.graphqlOptions.schema || this.bootstrapService.generateSchema();
        this.register();
    }

    register() {
        if (!this.config || !this.config.graphqlOptions) {
            throw new Error('Apollo Server requires options.');
        }
        console.log('APOLLO PLUGIN REGISTER');

        this.server.route(<any>{
            method: ['GET', 'POST'],
            path: this.config.path || '/graphql',
            vhost: this.config.vhost || undefined,
            config: this.config.route || {},
            handler: this.handler.bind(this)
        });
    }

    async handler(request, h) {
        try {
            if (request.headers.authorization && request.headers.authorization !== 'undefined') {
                try {
                    //   const serviceUtilsService: AuthService = Container.get(AuthService);
                    //   options.graphqlOptions.context = await serviceUtilsService.modifyFunctions.validateToken(request.headers.authorization);
                } catch (e) {
                    return Boom.unauthorized();
                }
            } else {
                this.config.graphqlOptions.context = null;
            }
            const gqlResponse = await runHttpQuery([request], <any>{
                method: request.method.toUpperCase(),
                options: this.config.graphqlOptions,
                query: request.method === 'post' ? request.payload : request.query,
            });

            const response = h.response(gqlResponse);
            response.type('application/json');
            return response;
        } catch (error) {
            if ('HttpQueryError' !== error.name) {
                throw Boom.boomify(error);
            }

            if (true === error.isGraphQLError) {
                const response = h.response(error.message);
                response.code(error.statusCode);
                response.type('application/json');
                return response;
            }

            const err = new Boom(error.message, { statusCode: error.statusCode });
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    err.output.headers[header] = error.headers[header];
                });
            }
            // Boom hides the error when status code is 500
            err.output.payload.message = error.message;
            throw err;
        }
    }

}