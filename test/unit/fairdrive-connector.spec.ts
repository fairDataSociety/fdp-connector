import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { FdpConnectModule } from '../../src/core/module'
import { FairosProvider } from '../../src/providers/fairos'

describe('fairdrive connector module', () => {
  let module: FdpConnectModule
  const username = process.env.USERNAME || ''
  const password = process.env.PASSWORD || ''

  beforeEach(async () => {
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
    const fairosConnector = await module.connect<FairosProvider>('fairos', FairosProvider)

    // eslint-disable-next-line
    expect((fairosConnector.filesystemDriver as any).host).toBe(`https://fairos.staging.fairdatasociety.org/`)
  })

  it('should list mounts', async () => {
    const fairosConnector = await module.connect<FairosProvider>('fairos', FairosProvider)

    // eslint-disable-next-line
    expect((fairosConnector.filesystemDriver as any).host).toBe(`https://fairos.staging.fairdatasociety.org/`)

    await fairosConnector.userLogin(username, password)
    const mounts = await fairosConnector.listMounts()
    expect(mounts.length).toBe(0)
  })

  xit('should list directories', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    //  const fairosConnector = module.bind('fairos')
  })

  xit('should list files', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    //    const fairosConnector = module.bind('fairos')
  })
})
