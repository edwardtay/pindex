/**
 * On-chain ETH price fetching from Uniswap V3 pools
 * Fully decentralized - no API dependencies
 */

import { Token } from '@uniswap/sdk-core';
import { PublicClient } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { QUOTER_V2_ABI } from './quoter';
import { getQuoterAddress } from './quoter';

// USDC address on mainnet (most liquid ETH/USDC pool)
const USDC_MAINNET = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const WETH_MAINNET = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

// USDC address on Sepolia
const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const WETH_SEPOLIA = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';

/**
 * Get ETH price in USD from Uniswap V3 ETH/USDC pool
 * Simple: try one fee tier (0.3%), if it fails return null
 */
export async function getEthPriceOnChain(
  publicClient: PublicClient,
  chainId: number
): Promise<number | null> {
  try {
    const quoterAddress = getQuoterAddress(chainId);
    const wethAddress = chainId === 1 ? WETH_MAINNET : WETH_SEPOLIA;
    const usdcAddress = chainId === 1 ? USDC_MAINNET : USDC_SEPOLIA;

    if (!quoterAddress || !publicClient) {
      return null;
    }

    // Quote 1 ETH -> USDC (using 0.3% fee tier - most common)
    const oneEth = parseUnits('1', 18);
    
    const result = await publicClient.readContract({
      address: quoterAddress,
      abi: QUOTER_V2_ABI,
      functionName: 'quoteExactInputSingle',
      args: [
        {
          token: wethAddress as `0x${string}`,
          fee: 3000, // 0.3% fee tier
          amountIn: oneEth,
          sqrtPriceLimitX96: BigInt(0),
        },
        usdcAddress as `0x${string}`,
      ],
    });

    const amountOut = result[0] as bigint;
    if (amountOut > BigInt(0)) {
      const price = parseFloat(formatUnits(amountOut, 6));
      return price;
    }

    return null;
  } catch (err) {
    // Fail silently, return null to use fallback
    return null;
  }
}

/**
 * Get cached or fetch ETH price
 * Falls back to reasonable default if on-chain fetch fails
 */
export async function getEthPrice(
  publicClient: PublicClient | null,
  chainId: number,
  fallbackPrice: number = 2500
): Promise<number> {
  if (!publicClient) {
    return fallbackPrice;
  }

  const onChainPrice = await getEthPriceOnChain(publicClient, chainId);
  return onChainPrice || fallbackPrice;
}

