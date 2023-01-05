import { FDPConnectModule, FDPConnectProvider } from '../../src/core/module'
import { FairOSAdapter } from '../../src/providers/fairos'

describe('fairdrive connector module', () => {
  let module: FDPConnectModule
  beforeAll(async () => {
    // Create a FairdriveConnectorModule
    module = new FDPConnectModule({
      scopes: ['files:read', 'directory:read'],
      providers: {
        fairos: {
          options: {
            url: 'https://fairos.dev.fairdatasociety.org/',
            loginV1: 'https://fairos.dev.fairdatasociety.org/v1/',
            loginV2: 'https://fairos.dev.fairdatasociety.org/v2/',
          },
          provider: '../../src/providers/fairos',
        },
      },
    })
  })
  it('should instantiate module with one provider', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = module.bind('fairos')

    // Query with REST API
    await fairosConnector.fileSystem.listPods()

    // Query with GraphQL
    await fairosConnector.fileSystem.query(`pods() { name  }`)
  })

  it('should list mounts', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = module.bind('fairos')

    // Query with REST API
    await fairosConnector.fileSystem.listPods()

    // Query with GraphQL
    await fairosConnector.fileSystem.query(`pods() { name  }`)
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
