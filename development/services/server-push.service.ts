import { Plugin, PluginInterface, BootstrapLogger, Inject, ExitHandlerService, AfterStarterService } from "@rxdi/core";
import { GRAPHQL_PLUGIN_CONFIG } from "../config.tokens";
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { Server as HapiServer } from 'hapi';
import { HAPI_SERVER } from "@rxdi/hapi";
import { Subject, Observable } from "rxjs";
import { map, switchMap, tap, filter, take, mergeMap, switchMapTo } from "rxjs/operators";
import { StartService } from "./start.service";

@Plugin()
export class ServerPushPlugin implements PluginInterface {
    serverWatcher: Server;
    connected: boolean;
    sendToClient: Subject<any> = new Subject();
    clientConnected: Subject<boolean> = new Subject();
    constructor(
        private logger: BootstrapLogger,
        @Inject(GRAPHQL_PLUGIN_CONFIG) private config: GRAPHQL_PLUGIN_CONFIG,
        @Inject(HAPI_SERVER) private server: HapiServer,
        private exitHandler: ExitHandlerService,
        private afterStarterService: AfterStarterService,
        private startService: StartService
    ) {
        this.exitHandler.errorHandler.subscribe(async (e) => {
            await this.stopServerWatcher();
        });

        this.server.events.on('response', (request) => {
            this.sendToClient.next({ query: request.payload, response: request.response['source'] });
        });

        this.waitXSeconds(3)
            .pipe(
                filter(() => !this.connected),
                filter(() => this.config.openBrowser),
                tap(() => this.startService.startBrowser())
            ).subscribe();
        // this.afterStarterService.appStarted
        //     .pipe(
        //         switchMapTo(this.clientConnected),
        //         take(1),
        //         filter(() => !!this.config.openBrowser),
        //         tap(() => this.startService.startBrowser())
        //     ).subscribe()
    }

    waitXSeconds(sec): Observable<any> {
        return Observable.create((o) => {
            const timeout = setTimeout(() => o.next(true), sec * 1000);
            return () => clearTimeout(timeout);
        })
    }

    async register() {
        this.createServerWatcher();
    }

    async stopServerWatcher() {
        return await new Promise((resolve) => this.serverWatcher.close(() => resolve()));
    }

    createServerWatcher() {
        this.serverWatcher = createServer(this.OnRequest.bind(this));
        this.serverWatcher.listen(8967);
    }

    OnRequest(req: IncomingMessage, res: ServerResponse) {
        if (req.url === '/status') {
            if (!this.connected) {
                this.clientConnected.next(true);
                res.write("data: " + JSON.stringify({ response: { init: true } }) + "\n\n");
    
            }
            this.connected = true;

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            this.sendToClient.subscribe((data) => {
                res.write("data: " + JSON.stringify(data) + "\n\n");
                this.connected = true;
            });
            req.on('end', () => {
                this.connected = false;
                req.destroy();
            });
            return;
        }
        res.statusCode = 400;
        return res.end();
    }

}