import { Adapter } from 'file-system-access/lib/interfaces'
import { FdpConnectModuleConfig } from './module-config'
import { Permission } from './permission'
import { FdpConnectProvider, FdpOptions } from './provider'
import { FdpConnectProviderConfig } from './provider-config'

export class FdpConnectModule {
  constructor(public config: FdpConnectModuleConfig) {}

  async bind(providerName: string): Promise<Adapter<FdpOptions>> {
    const p = await import(this.config[providerName].provider as string)

    return p.default
  }
}
