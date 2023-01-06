import { ReadableStream } from 'file-system-access/lib/web-streams-ponyfill.js'
import { getOriginPrivateDirectory } from 'file-system-access/lib/node.js'
import { FdpConnectModuleConfig } from './module-config'

// eslint-disable-next-line
// @ts-ignore
globalThis.Blob = Blob

// eslint-disable-next-line
// @ts-ignores
globalThis.ReadableStream = ReadableStream

export class Binding<T> {
  fileSystem: FileSystemDirectoryHandle
  instance: T

  constructor(fileSystem: FileSystemDirectoryHandle, instance: T) {
    this.fileSystem = fileSystem
    this.instance = instance
  }
}
export class FdpConnectModule {
  constructor(public config: FdpConnectModuleConfig) {}

  async bind<T>(providerName: string): Promise<Binding<T>> {
    const provider = await import(this.config.providers[providerName].provider as string)

    provider.initialize()

    const fs = await getOriginPrivateDirectory(provider, this.config.providers[providerName].options)

    const binding = new Binding(fs, provider as T)

    return binding
  }
}
