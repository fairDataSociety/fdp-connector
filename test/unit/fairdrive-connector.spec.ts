import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { FdpConnectModule } from '../../src/core/module'
import { FairosProvider } from '../../src/providers/fairos'

describe('fairdrive connector module', () => {
  let module: FdpConnectModule
  const username = process.env.USERNAME || ''
  const password = process.env.PASSWORD || ''

  beforeAll(async () => {
    // Create a FairdriveConnectorModule
    module = new FdpConnectModule({
      scopes: ['files:read', 'directory:read'],
      providers: {
        fairos: {
          options: {
            host: 'https://fairos.staging.fairdatasociety.org/',
          },
          provider: '../../src/providers/fairos',
        },
      },
    })
  })
  it('should instantiate module with one provider', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = await module.bind<FairosProvider>('fairos')

    expect(fairosConnector.fileSystem).toBeDefined()
  })

  it('should list mounts', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = await module.bind<FairosProvider>('fairos')

    expect(fairosConnector.fileSystem).toBeDefined()

    await fairosConnector.instance.userLogin(username, password)
    const mounts = await fairosConnector.instance.listMounts()
    expect(mounts).toBeDefined()
  })

  it('should list directories', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = module.bind('fairos')
  })

  it('should list files', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = module.bind('fairos')
  })
})
