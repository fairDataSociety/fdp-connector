import { FdpConnectProvider, Mount, ProviderDriver } from '../core/provider'
import { FdpStorage } from '@fairdatasociety/fdp-storage'
export class FdpStorageProvider extends FdpConnectProvider implements ProviderDriver {
  constructor(private fdp: FdpStorage) {
    super({
      name: 'FdpStorageProvider',
    })
  }

  /**
   * Returns true if the file exists, else false
   * @param name - name of the file
   * @returns
   */
  async exists(name: string): Promise<boolean> {
    try {
      return this.fdp.connection.bee.isReferenceRetrievable(name)
    } catch (e) {
      return false
    }
  }

  /**
   * Create a directory
   * @param name - name of the directory
   * @param mount - mount to create the directory in
   */
  async createDir(name: string, mount: Mount): Promise<any> {
    return this.fdp.directory.create(mount.name, `${mount.path}${name}`)
  }

  /**
   * Delete a file
   * @param name - name of the file
   * @param mount - mount to delete the file from
   */
  async delete(name: string, mount: Mount): Promise<any> {
    return this.fdp.file.delete(mount.name, `${mount.path}${name}`)
  }

  /**
   * Read a directory
   * @param path - path to read the directory from
   * @param mount - mount to read the directory from
   * @returns - list of files and directories
   */
  async read(path: string, mount: Mount): Promise<any> {
    const res = await this.fdp.directory.read(mount.name, `${mount.path}${path}`)

    return {
      files: res.getFiles(),
      dirs: res.getDirectories(),
    }
  }

  /**
   * Download a file
   * @param name - name of the file
   * @param mount - mount to download the file from
   * @returns
   */
  async download(name: string, mount: Mount, options = { path: '/' }): Promise<any> {
    return this.fdp.file.downloadData(mount.name, `${mount.path}${name}`)
  }

  /**
   * Upload a file
   * @param file - file to upload
   * @param mount - mount to upload the file to
   */
  async upload(file: File, mount: Mount, options = { path: '/' }): Promise<any> {
    const buffer = await file.arrayBuffer()

    await this.fdp.file.uploadData(mount.name, `${mount.path}${file.name}`, Buffer.from(buffer))
  }
}
