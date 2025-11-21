import { Token, Currency, NativeCurrency } from '@uniswap/sdk-core';
import { Ether } from '@uniswap/sdk-core';

// WETH addresses for wrapping ETH
export const WETH_ADDRESSES: Record<number, string> = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Mainnet
  11155111: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // Sepolia
};

// Common tokens by chain ID - Expanded list
export const COMMON_TOKENS: Record<number, Token[]> = {
  // Mainnet - Popular tokens
  1: [
    new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
    new Token(1, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
    new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
    new Token(1, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped Bitcoin'),
    new Token(1, '0x514910771AF9Ca656af840dff83E8264EcF986CA', 18, 'LINK', 'Chainlink'),
    new Token(1, '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', 18, 'MATIC', 'Polygon'),
    new Token(1, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uniswap'),
    new Token(1, '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', 18, 'SNX', 'Synthetix Network'),
    new Token(1, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker'),
    new Token(1, '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', 18, 'MANA', 'Decentraland'),
  ],
  // Sepolia
  11155111: [
    new Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    new Token(11155111, '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', 6, 'USDC', 'USD Coin'),
  ],
};

// Get ETH token (using WETH address for swaps)
export const getETHToken = (chainId: number): Token => {
  const wethAddress = WETH_ADDRESSES[chainId];
  if (!wethAddress) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  return new Token(chainId, wethAddress as `0x${string}`, 18, 'ETH', 'Ether');
};

// Get USDC token
export const getUSDCToken = (chainId: number): Token | null => {
  const tokens = COMMON_TOKENS[chainId] || [];
  return tokens.find(t => t.symbol === 'USDC') || null;
};

