// Uniswap V3 Swap Router addresses
export const SWAP_ROUTER_ADDRESS: Record<number, `0x${string}`> = {
  1: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Mainnet
  11155111: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E', // Sepolia (example)
};

// Default to mainnet if chain not found
export const getSwapRouterAddress = (chainId: number): `0x${string}` => {
  return SWAP_ROUTER_ADDRESS[chainId] || SWAP_ROUTER_ADDRESS[1];
};


