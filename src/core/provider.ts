import {
  Adapter,
  FileSystemFileHandleAdapter,
  FileSystemFolderHandleAdapter,
  WriteChunk,
} from 'file-system-access/lib/interfaces'

import { FdpConnectProviderConfig } from './provider-config'
const { INVALID, GONE, SYNTAX } = errors
import { errors } from 'file-system-access/lib/util.js'

export interface FdpOptions {
  mount: string
  path: string
}

export interface ProviderDriver {
  exists: (...args: any[]) => Promise<any> // no typing yet...
  create: (...args: any[]) => Promise<any> // no typing yet...
  delete: (...args: any[]) => Promise<any> // no typing yet...
  read: (...args: any[]) => Promise<any> // no typing yet...
  download: (...args: any[]) => Promise<any> // no typing yet...
  upload: (...args: any[]) => Promise<any> // no typing yet...
}
export abstract class FdpConnectProvider {
  constructor(private config: FdpConnectProviderConfig) {}
}

const File = globalThis.File
const Blob = globalThis.Blob

export interface Mount {
  path: string
  name: string
}

export class FairDriveMount implements Mount {
  path: string
  name: string
}
class Sink implements UnderlyingSink<WriteChunk> {
  private file: File
  private position = 0

  driver: ProviderDriver
  mount: Mount

  constructor(mount: Mount, driver: ProviderDriver, file: File) {
    this.mount = mount
    this.driver = driver
    this.file = file
  }

  /**
   *
   * @param key
   * @param options
   * @returns
   */
  async has(key: string): Promise<boolean> {
    try {
      return this.driver.exists(key)
    } catch (e) {
      return false
    }
  }

  async write(chunk: WriteChunk) {
    this.file = chunk as File
  }

  async close() {
    return new Promise<void>(async (resolve, reject) => {
      const buffer = await this.file.arrayBuffer()
      try {
        await this.driver.upload(this.mount.name, `${this.mount.path}${this.file.name}`, Buffer.from(buffer))
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

// FS File Handle
export class FileHandle implements FileSystemFileHandleAdapter {
  public readonly name: string
  public readonly kind = 'file'
  mount: Mount
  driver: ProviderDriver
  public onclose?(self: this): void

  constructor(mount: Mount, driver: ProviderDriver, name: string) {
    this.mount = mount
    this.driver = driver
    this.name = name
  }
  writable = true

  async getFile() {
    try {
      const data = await this.driver.download(this.mount.name, `${this.mount.path}${this.name}`)

      return new File([data.buffer], this.name)
    } catch (e) {
      throw new DOMException(...GONE)
    }
  }

  async createWritable(opts?: FileSystemCreateWritableOptions) {
    let file
    if (opts && !opts.keepExistingData) {
      file = new File([], this.name)
    } else {
      file = await this.getFile()
    }

    return new Sink(this.mount, this.driver, file)
  }

  async isSameEntry(other: FileHandle) {
    // TODO: Add path separator
    return this.name === other.name
  }
}

// FS Folder Handle
export class FolderHandle implements FileSystemFolderHandleAdapter {
  public readonly path: string
  public readonly kind = 'directory'
  readonly name: string

  mount: Mount
  writable = true
  readable = true
  driver: ProviderDriver

  constructor(mount: Mount, driver: ProviderDriver, name: string) {
    this.mount = mount
    this.driver = driver
    this.name = name
  }

  async *entries() {
    const entries = await this.driver.read(this.mount)

    if (entries && entries.getDirectories().length > 0) {
      for (let entry of entries.getDirectories()) {
        yield [entry.name, new FolderHandle(this.mount, this.driver, this.name)] as [string, FolderHandle]
      }
    }

    if (entries && entries.getFiles().length > 0) {
      for (let entry of entries.getFiles()) {
        yield [entry.name, new FileHandle(this.mount, this.driver, this.name)] as [string, FileHandle]
      }
    }
  }

  async isSameEntry(other: FolderHandle) {
    return this.path === other.path
  }

  async getDirectoryHandle(name: string, opts: FileSystemGetDirectoryOptions = {}) {
    return new Promise<FolderHandle>(async (resolve, reject) => {
      if (opts.create) {
        await this.driver.create(this.mount.name, `${this.mount.path}${name}`)

        resolve(new FolderHandle(this.mount, this.driver, name))
      } else {
        try {
          const entries = await this.driver.read(this.mount.name, `${this.path}${name}`)

          if (entries.raw) {
            resolve(new FolderHandle(this.mount, this.driver, name))
          }
        } catch (e) {
          reject(new DOMException(...GONE))
        }
      }
    })
  }

  async getFileHandle(name: string, opts: FileSystemGetFileOptions = {}) {
    return new Promise<FileHandle>(async (resolve, reject) => {
      try {
        if (opts.create) {
          resolve(new FileHandle(this.mount, this.driver, name))
        } else {
          const data = await this.driver.download(this.mount.name, `${this.mount.path}${name}`)
          resolve(new FileHandle(this.mount, this.driver, name))
        }
      } catch (e) {
        reject(new DOMException(...GONE))
      }
    })
  }

  async removeEntry(name: string, opts: FileSystemRemoveOptions = {}) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.driver.delete(this.mount.name, `${this.mount.path}${name}`)
      } catch (e) {
        reject(new DOMException(...GONE))
      }
    })
  }
}
const adapter: Adapter<FdpOptions> = async (mount: Mount, driver: ProviderDriver) =>
  new Promise(resolve => {
    resolve(new FolderHandle(mount, driver, ''))
  })

export default adapter
