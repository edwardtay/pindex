'use client';

import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createFallbackTransport } from '@/utils/rpcProviders';
import { injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const chains = [mainnet, sepolia] as const;

// Build connectors - detect Brave, MetaMask, and other injected wallets
const connectors = [
  injected({
    target: 'metaMask', // MetaMask
  }),
  injected({
    target: 'braveWallet', // Brave Wallet
  }),
  injected(), // Generic injected (catches others)
];

// Use decentralized RPC with fallbacks
const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: createFallbackTransport(1),
    [sepolia.id]: createFallbackTransport(11155111),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
});

// Initialize Web3Modal only if we have a valid projectId
// Otherwise, use direct wagmi connectors (fully decentralized)
let web3ModalInitialized = false;
if (typeof window !== 'undefined') {
  // Only initialize Web3Modal if we have a valid projectId
  if (projectId && projectId.length >= 32 && projectId !== 'demo-project-id-placeholder-for-development-only') {
    try {
      createWeb3Modal({
        wagmiConfig: config,
        projectId: projectId,
        themeMode: 'dark',
        enableAnalytics: false,
      });
      web3ModalInitialized = true;
      console.log('Web3Modal initialized successfully');
    } catch (error: any) {
      console.error('Web3Modal initialization failed:', error);
      // Fall back to direct connectors
    }
  } else {
    console.info(
      'Web3Modal not initialized - using direct wallet connections. ' +
      'Get a WalletConnect Project ID at https://cloud.walletconnect.com/ for WalletConnect support.'
    );
  }
}

// Export initialization status for components to check
export const isWeb3ModalInitialized = () => web3ModalInitialized;

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

