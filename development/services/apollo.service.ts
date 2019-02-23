import { Service, Inject, PluginInterface, Container } from '@rxdi/core';
import * as Boom from 'boom';
import { Server, Request, ResponseToolkit } from 'hapi';
import { runHttpQuery } from 'apollo-server-core';
import { HAPI_SERVER } from '@rxdi/hapi';
import { GRAPHQL_PLUGIN_CONFIG } from '../config.tokens';
import { BootstrapService } from '../services/bootstrap.service';
import { GraphQLSchema } from 'graphql';

@Service()
export class ApolloService implements PluginInterface {

    constructor(
        @Inject(HAPI_SERVER) private server: Server,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG,
        private bootstrapService: BootstrapService
    ) { }

    OnInit() {
        let customSchemaDefinition: GraphQLSchema;
        try { customSchemaDefinition = Container.get('gapi-custom-schema-definition'); } catch (e) { }
        this.config.graphqlOptions.schema = customSchemaDefinition || this.config.graphqlOptions.schema || this.bootstrapService.generateSchema();
        this.register();
    }

    register() {
        if (!this.config || !this.config.graphqlOptions) {
            throw new Error('Apollo Server requires options.');
        }
        this.server.route(<any>{
            method: ['GET', 'POST'],
            path: this.config.path || '/graphql',
            vhost: this.config.vhost,
            config: this.config.route || {},
            handler: this.handler
        });
    }

    handler = async (request: Request, h: ResponseToolkit, err?: Error) => {
        try {
            this.config.graphqlOptions.context = this.config.graphqlOptions.context || {};
            if (request.headers.authorization && request.headers.authorization !== 'undefined' && this.config.authentication) {
                try {
                    const serviceUtilsService: any = Container.get(<any>this.config.authentication);
                    this.config.graphqlOptions.context.user = await serviceUtilsService.validateToken(request.headers.authorization);
                } catch (e) {
                    return Boom.unauthorized();
                }
            } else {
                this.config.graphqlOptions.context.user = null;
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
            if (error && error.message.constructor === String && error.message.includes('must be Output Type but got')) {
                console.log('Maybe you are trying to cross reference Schema Type? Instead of fields: {test: {type: GraphQLString }} try lazy evaluated fields: () => ({test: {type: GraphQLString }})');
                console.error(error);
            }
            if (true === error.isGraphQLError) {
                const response = h.response(error.message);
                response.code(error.statusCode);
                response.type('application/json');
                return response;
            }

            const err = new Boom(error.message, { statusCode: error.statusCode });
            if (error.headers) {
                Object.keys(error.headers).forEach(header => err.output.headers[header] = error.headers[header]);
            }
            // Boom hides the error when status code is 500
            err.output.payload.message = error.message;
            throw err;
        }
    }

}