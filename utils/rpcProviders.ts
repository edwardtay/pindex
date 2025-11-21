/**
 * Decentralized RPC Provider Configuration
 * Multiple fallbacks to ensure no single point of failure
 */

import { http, fallback } from 'viem';

// Public RPC endpoints (decentralized)
// Multiple fallbacks ensure no single point of failure
export const MAINNET_RPC_ENDPOINTS = [
  'https://eth.llamarpc.com', // LlamaNodes (public)
  'https://rpc.ankr.com/eth', // Ankr (public)
  'https://ethereum.publicnode.com', // PublicNode (decentralized)
  'https://eth.drpc.org', // dRPC (decentralized)
  'https://1rpc.io/eth', // 1RPC (public)
  'https://rpc.flashbots.net', // Flashbots (public)
  'https://eth.merkle.io', // Merkle (public)
] as const;

export const SEPOLIA_RPC_ENDPOINTS = [
  'https://sepolia.llamarpc.com',
  'https://rpc.ankr.com/eth_sepolia',
  'https://ethereum-sepolia.publicnode.com',
  'https://sepolia.drpc.org',
  'https://rpc.sepolia.org', // Sepolia Foundation
] as const;

/**
 * Create fallback transport for a chain
 * Automatically tries next provider if one fails
 */
export function createFallbackTransport(chainId: number) {
  const endpoints = chainId === 1 ? MAINNET_RPC_ENDPOINTS : SEPOLIA_RPC_ENDPOINTS;
  
  return fallback(
    endpoints.map((url) => http(url, { 
      retryCount: 2,
      retryDelay: 1000,
    })),
    {
      retryCount: 3,
    }
  );
}

/**
 * Get primary RPC endpoint (for direct use)
 */
export function getPrimaryRpcEndpoint(chainId: number): string {
  const endpoints = chainId === 1 ? MAINNET_RPC_ENDPOINTS : SEPOLIA_RPC_ENDPOINTS;
  return endpoints[0];
}


