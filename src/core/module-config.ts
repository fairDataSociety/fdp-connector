export class FdpConnectModuleConfig {
  providers: Record<string, Record<string, string | object>> = {}
  scopes: string[] = ['files:read', 'directory:read']
}
