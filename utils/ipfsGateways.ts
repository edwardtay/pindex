/**
 * IPFS Gateway Configuration
 * Multiple fallbacks for decentralized content access
 */

export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
  'https://ipfs.filebase.io/ipfs/',
] as const;

/**
 * Get IPFS content URL with fallback
 */
export function getIpfsUrl(cid: string, gatewayIndex: number = 0): string {
  const gateway = IPFS_GATEWAYS[gatewayIndex % IPFS_GATEWAYS.length];
  return `${gateway}${cid}`;
}

/**
 * Try multiple IPFS gateways until one works
 */
export async function fetchFromIpfs(cid: string): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const url = getIpfsUrl(cid, i);
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        return fetch(url);
      }
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }
  
  throw lastError || new Error('All IPFS gateways failed');
}


