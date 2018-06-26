import { BootstrapLogger } from "@rxdi/core";
import { ExitHandlerService } from "@rxdi/core/services/exit-handler/exit-handler.service";
import { Server, PluginBase, PluginNameVersion, PluginPackage } from "hapi";
export declare type PluginType<T> = (PluginBase<T> & (PluginNameVersion | PluginPackage))[];
export declare class ServerService {
    private server;
    private plugins;
    private logger;
    private exitHandler;
    constructor(server: Server, plugins: PluginType<any>, logger: BootstrapLogger, exitHandler: ExitHandlerService);
    start(): Promise<void>;
    registerPlugins<T>(plugins: PluginType<T>): Promise<void>;
}
