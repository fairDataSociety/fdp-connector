import { FdpConnectModuleConfig } from './module-config'
import { FdpConnectProvider } from './provider'

export class FdpConnectModule {
  bindings: Map<string, FdpConnectProvider> = new Map()
  constructor(public config: FdpConnectModuleConfig) {}

  connect<T extends FdpConnectProvider>(providerName: string, provider: { new (): T }) {
    const providerInstance = new provider()
    providerInstance.initialize(this.config.providers[providerName].options)

    this.bindings.set(providerName, providerInstance)

    return providerInstance
  }

  getConnectedProviders<T extends FdpConnectProvider>(providerName: string): T {
    return this.bindings.get(providerName) as T
  }
}
