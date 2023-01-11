import { Mount, Entries } from './provider'

/**
 * ProviderDriver is the interface that all providers must implement that adheres for W3C FileSystem API.
 */
export interface ProviderDriver {
  exists: (name: string, mount: Mount) => Promise<boolean>
  createDir: (name: string, mount: Mount) => Promise<any>
  delete: (name: string, mount: Mount) => Promise<any>
  read: (mount: Mount) => Promise<Entries>
  download: (name: string, mount: Mount, options: any) => Promise<any>
  upload: (file: File, mount: Mount, options: any) => Promise<any>
}
