import { getOriginPrivateDirectory } from 'file-system-access'
import { FdpConnectModuleConfig } from './module-config'

export class FdpConnectModule {
  constructor(public config: FdpConnectModuleConfig) {}

  async bind(providerName: string): Promise<FileSystemDirectoryHandle> {
    const provider = await import(this.config.providers[providerName].provider as string)

    return getOriginPrivateDirectory(provider, this.config.providers[providerName].options)
  }
}
