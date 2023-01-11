import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { FdpConnectModule } from '../../src/core/module'
import { FairosProvider } from '../../src/providers/fairos'
import fetchMock from 'jest-fetch-mock'

describe('fairdrive connector module', () => {
  let module: FdpConnectModule
  const username = process.env.USERNAME || ''
  const password = process.env.PASSWORD || ''

  afterEach(() => {
    fetchMock.resetMocks()
  })
  beforeEach(async () => {
    fetchMock.doMock()

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

    expect(fairosConnector).toBeDefined()
  })

  it('should list mounts', async () => {
    const fairosConnector = await module.connect<FairosProvider>('fairos', FairosProvider)

    expect(fairosConnector).toBeDefined()
    fetchMock.mockResponseOnce(
      JSON.stringify({
        address: 'string',
        message: 'string',
        nameHash: 'string',
        publicKey: 'string',
      }),
    )

    await fairosConnector.userLogin(username, password)

    expect(fetchMock).toHaveBeenCalled()

    fetchMock.mockResponseOnce(
      JSON.stringify({
        pods: ['panama', 'colombia', 'costa_rica'],
        sharedPods: ['nicaragua'],
      }),
    )

    const mounts = await fairosConnector.listMounts()
    expect(fetchMock).toHaveBeenCalled()

    expect(mounts.length).toBe(3)
  })

  it('should list directories', async () => {
    const fairosConnector = await module.connect<FairosProvider>('fairos', FairosProvider)

    expect(fairosConnector).toBeDefined()
    fetchMock.mockResponseOnce(
      JSON.stringify({
        address: 'string',
        message: 'string',
        nameHash: 'string',
        publicKey: 'string',
      }),
    )

    await fairosConnector.userLogin(username, password)

    expect(fetchMock).toHaveBeenCalled()

    fetchMock.mockResponseOnce(
      JSON.stringify({
        pods: ['panama', 'colombia', 'costa_rica'],
        sharedPods: ['nicaragua'],
      }),
    )

    const mounts = await fairosConnector.listMounts()
    expect(fetchMock).toHaveBeenCalled()

    expect(mounts.length).toBe(3)

    await fairosConnector.getFSHandler(mounts[0])
  })

  xit('should list files', async () => {
    // Provider constructor interface: Provider(baseProvider, options { signer })
    //    const fairosConnector = module.bind('fairos')
  })
})
