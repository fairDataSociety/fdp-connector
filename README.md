# fairdrive-connector
Fairdrive Connector - integrate data sources from Web 2.0 or Web 3.0


```typescript
import {
  FairdriveConnectorModule,
  FardriveConnectorProvider
} from '@fairdatasociety/connector/core';
import {
 FairOSProvider,
 FairOSConfiguration,
} from '@fairdatasociety/connector/providers';
import {
 IPFSProvider,
 IPFSConfiguration,
} from '@fairdatasociety/ipfs-provider';

// Create a FairdriveConnectorModule
export const module = new FdpConnectModule({
  permissions: ["files:read", "directory:read"],
  queryEngine: "graphql", // graphql or rest
  "providers": [
    "fairos": {
      url: "http://fairos",
      beeUrl: "http://bee",
      provider: FairOSProvider,
    } as FairOSConfiguration,
    "ipfs": {
      url: "http://ipfs",
      beesonBridgeSync: "http://beeson-block-bridge", // beeson-multiformats brige
      gatewayUrl: "http://ipfs-gateway",
      provider: IPFSProvider
    } as IPFSConfiguration
  ],
});

const privateKey = '0x............';
const chainId = '1';
const rpcUrl = 'http://localhost:8545';
const web3Provider = window.ethereum;
const rpcChain = new Web3(rpcUrl, chainId);

// Provider constructor interface: Provider(baseProvider, options { signer })
const fairosConnector = module.bindConnection('fairos', new EthereumRPCProvider(rpcChain, privateKey));
const ipfsCeramicConnector = module.bindConnection('ipfs', new 3IDProvider(web3Provider))

// Query with REST API
await fairosConnector.fileSystem.listPods();

// Query with GraphQL
await fairosConnector.fileSystem.query(`pods() { name  }`);

// Query with  GraphQL from module
await module.query(
`pods() { name }`,
[
    fairosConnector,
    ipfsCeramicConnector,
])

// Signing request
await fairosConnector.fileSystem.uploadFile(..., { requestSignatureApproval: true } )

// Multiformats traversal query
await ipfsCeramicConnector.queryTraversal(...)
```