import { FdpConnectModuleConfig } from './module-config'
import { Permission } from './permission'
import { FdpConnectProvider } from './provider'
import { FdpConnectProviderConfig } from './provider-config'

export class FdpConnectModule {
  providers!: {
    [providerName: string]: FdpConnectProvider
  }
  permissions: Permission[] = []

  public static LoadModuleConfig(config: FdpConnectModuleConfig) {

  }

  // addProvider<FairOSProvider, FairOSProviderConfig>
  private addProvider<T extends FdpConnectProvider, A extends FdpConnectProviderConfig>(
    provider: new (config: FdpConnectProviderConfig) => T,
    providerConfig: A,
  ) {
    this.providers[providerConfig.name] = new provider(providerConfig)
  }
}
