'use client';

import { Token } from '@uniswap/sdk-core';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { WETH_ADDRESSES } from '@/utils/tokens';

export function useTokenBalance(token: Token | null) {
  const { address } = useAccount();
  const chainId = useChainId();
  
  // For ETH, use native balance
  const isETH = token?.symbol === 'ETH' || token?.symbol === 'WETH';
  const tokenAddress = isETH ? undefined : (token?.address as `0x${string}`);
  
  const { data: balance, isLoading } = useBalance({
    address,
    token: tokenAddress,
  });

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, token?.decimals || 18)).toFixed(6)
    : '0.0';

  return {
    balance: formattedBalance,
    rawBalance: balance?.value || BigInt(0),
    isLoading,
  };
}


