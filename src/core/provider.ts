import { FdpConnectProviderConfig } from "./provider-config";

export abstract class FdpConnectProvider {
    constructor(private config: FdpConnectProviderConfig){}
}