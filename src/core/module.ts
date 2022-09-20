import { Permission } from './permission'
import { FdpConnectProvider } from './provider'
import { FdpConnectProviderConfig } from './provider-config'

export class FdpConnectModule {
  providers!: {
    [providerName: string]: FdpConnectProvider
  }
  permissions: Permission[] = []

  // addProvider<FairOSProvider, FairOSProviderConfig>
  addProvider<T extends FdpConnectProvider, A extends FdpConnectProviderConfig>(
    provider: new (config: FdpConnectProviderConfig) => T,
    providerConfig: A,
  ) {
    this.providers[providerConfig.name] = new provider(providerConfig)
  }
}
