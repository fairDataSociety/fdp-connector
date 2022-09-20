import { FdpConnectProvider } from '../core/provider'

export class FairosProvider extends FdpConnectProvider {
  constructor() {
    super({
      name: 'Fairos',
    })
  }
}
