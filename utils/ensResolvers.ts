/**
 * ENS Resolver Configuration
 * Multiple resolvers for decentralized name resolution
 */

export const ENS_RESOLVERS = [
  'https://eth.llamarpc.com', // LlamaNodes
  'https://rpc.ankr.com/eth', // Ankr
  'https://ethereum.publicnode.com', // PublicNode
] as const;

/**
 * Resolve ENS name using multiple RPC providers
 */
export async function resolveEnsName(
  name: string,
  rpcUrl: string
): Promise<string | null> {
  try {
    // Use the provided RPC URL to resolve ENS
    // In production, use ethers.js or viem ENS resolver
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // ENS Registry
            data: `0x0178b8bf${name.slice(0, -4).padStart(64, '0')}`, // Simplified
          },
          'latest',
        ],
        id: 1,
      }),
    });
    
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('ENS resolution failed:', error);
    return null;
  }
}


