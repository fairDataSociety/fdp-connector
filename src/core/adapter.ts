import { Adapter } from 'file-system-access/lib/interfaces'
import { FdpAdapterOptions } from './adapter-options'
import { Mount, FolderHandle } from './provider'
import { ProviderDriver } from './provider-driver'

/**
 * FdpConnectAdapter is a function that returns a promise that resolves to a FolderHandle
 * @param mount Mount point
 * @param driver Driver to use
 * @returns A promise that resolves to a FolderHandle
 */
const FdpConnectAdapter: Adapter<FdpAdapterOptions> = async (mount: Mount, driver: ProviderDriver) =>
  new Promise(resolve => {
    resolve(new FolderHandle(mount, driver))
  })

export default FdpConnectAdapter
