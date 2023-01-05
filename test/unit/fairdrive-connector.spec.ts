import { FDPConnectModule, FDPConnectProvider } from '../../src/core/module'
import { FairOSAdapter } from '../../src/providers/fairos'

describe('fairdrive connector module', () => {
  beforeAll(async () => {
    // Create a FairdriveConnectorModule
    const module = new FDPConnectModule({
      scopes: ['files:read', 'directory:read'],
      providers: {
        fairos: {
          options: {
            url: 'http://fairos',
            beeUrl: 'http://bee',
          },
          provider: '../../src/providers/fairos',
        },
      },
    })

    // Provider constructor interface: Provider(baseProvider, options { signer })
    const fairosConnector = module.bind('fairos')

    // Query with REST API
    await fairosConnector.fileSystem.listPods()

    // Query with GraphQL
    await fairosConnector.fileSystem.query(`pods() { name  }`)
  })
  it('should instantiate module with one provider', async () => {})
})
