'use client';

import { useState, useEffect } from 'react';
import { useGasPrice, usePublicClient, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { Token } from '@uniswap/sdk-core';
import { getEthPrice } from '@/utils/ethPrice';

interface UseGasEstimateProps {
  enabled: boolean;
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
  routerAddress?: `0x${string}`;
}

export function useGasEstimate({
  enabled,
  tokenIn,
  tokenOut,
  amountIn,
  routerAddress,
}: UseGasEstimateProps) {
  const { data: gasPrice } = useGasPrice({
    query: { enabled },
  });
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const [ethPrice, setEthPrice] = useState<number>(2500); // Fallback price

  // Fetch ETH price on-chain when enabled
  useEffect(() => {
    if (enabled && publicClient) {
      getEthPrice(publicClient, chainId, 2500).then((price) => {
        setEthPrice(price);
      });
    }
  }, [enabled, publicClient, chainId]);

  // Estimate gas for swap (approximate - actual will vary)
  // Typical Uniswap swap uses ~150k-200k gas
  const estimatedGas = 180000n; // Conservative estimate
  
  const estimatedCost = gasPrice && estimatedGas
    ? formatUnits(gasPrice * estimatedGas, 18)
    : null;

  const estimatedCostUSD = estimatedCost
    ? (parseFloat(estimatedCost) * ethPrice).toFixed(2) // On-chain ETH price
    : null;

  return {
    estimatedGas,
    estimatedCost,
    estimatedCostUSD,
    gasPrice,
    ethPrice,
    isLoading: enabled && !gasPrice,
  };
}

