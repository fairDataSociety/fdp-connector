import {
  FileSystemFileHandleAdapter,
  FileSystemFolderHandleAdapter,
  WriteChunk,
} from 'file-system-access/lib/interfaces'

const { INVALID, GONE, SYNTAX } = errors
import { errors } from 'file-system-access/lib/util.js'

// FairDrive adapter options
export interface FdpOptions {
  mount: string
  path: string
}

//
export interface Entries {
  files: string[]
  dirs: string[]
}

export interface ProviderDriver {
  exists: (name: string, mount: Mount) => Promise<boolean>
  createDir: (name: string, mount: Mount) => Promise<any>
  delete: (name: string, mount: Mount) => Promise<any>
  read: (mount: Mount) => Promise<Entries>
  download: (name: string, mount: Mount, options: any) => Promise<any>
  upload: (file: File, mount: Mount, options: any) => Promise<any>
}

export abstract class FdpConnectProvider {
  constructor(private config: any) {}

  filesystemDriver!: ProviderDriver
  initialize(options: any) {
    Object.assign(this, options)
  }
}

const File = globalThis.File
const Blob = globalThis.Blob

export interface Mount {
  path: string
  name: string
}

export class FairDriveMount implements Mount {
  path = ''
  name = ''
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
      return this.driver.exists(key, this.mount)
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
        await this.driver.upload(this.file, this.mount, Buffer.from(buffer))
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
      const data = await this.driver.download(`${this.mount.path}${this.name}`, this.mount, {})

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

  constructor(mount: Mount, driver: ProviderDriver) {
    this.mount = mount
    this.driver = driver
    this.name = this.mount.name
    this.path = this.mount.path
  }

  async *entries() {
    const entries = await this.driver.read(this.mount)

    if (entries && entries.dirs.length > 0) {
      for (const entry of entries.dirs) {
        yield [entry, new FolderHandle(this.mount, this.driver)] as [string, FolderHandle]
      }
    }

    if (entries && entries.files.length > 0) {
      for (const entry of entries.files) {
        yield [entry, new FileHandle(this.mount, this.driver, entry)] as [string, FileHandle]
      }
    }
  }

  async isSameEntry(other: FolderHandle) {
    return this.path === other.path
  }

  async getDirectoryHandle(name: string, opts: FileSystemGetDirectoryOptions = {}) {
    return new Promise<FolderHandle>(async (resolve, reject) => {
      if (opts.create) {
        await this.driver.createDir(`${this.mount.path}${name}`, this.mount)

        resolve(new FolderHandle(this.mount, this.driver))
      } else {
        try {
          const entries = await this.driver.read(this.mount)

          if (entries.files.length > 0 || entries.dirs.length > 0) {
            resolve(new FolderHandle(this.mount, this.driver))
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
          const data = await this.driver.download(`${this.mount.path}${name}`, this.mount, {})
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
        await this.driver.delete(`${this.mount.path}${name}`, this.mount)
      } catch (e) {
        reject(new DOMException(...GONE))
      }
    })
  }
}

const FdpConnectAdapter = async (mount: Mount, driver: ProviderDriver) =>
  new Promise(resolve => {
    resolve(new FolderHandle(mount, driver))
  })

export default FdpConnectAdapter
