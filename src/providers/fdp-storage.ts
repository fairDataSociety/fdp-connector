import { FdpConnectProvider } from '../core/provider'

export class FdpStorageProvider extends FdpConnectProvider {
  constructor() {
    super({
      name: 'FdpStorageProvider',
    })
  }
}
