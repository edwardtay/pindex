'use client';

import { useEffect } from 'react';
import { Token } from '@uniswap/sdk-core';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import { getSwapRouterAddress } from '@/utils/constants';

const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export function useTokenApproval(token: Token | null, amount: string) {
  const { address } = useAccount();
  const chainId = useChainId();
  const routerAddress = getSwapRouterAddress(chainId);
  
  const amountNeeded = token && amount
    ? parseUnits(amount, token.decimals)
    : BigInt(0);

  const { data: allowance, isLoading: isLoadingAllowance, refetch: refetchAllowance } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && token ? [address, routerAddress] : undefined,
    query: {
      enabled: !!token && !!address && token.symbol !== 'ETH' && token.symbol !== 'WETH',
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchInterval: 10000, // Refetch every 10 seconds to keep allowance updated
    },
  });

  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Refetch allowance after successful approval to update UI immediately
  useEffect(() => {
    if (isApproved && refetchAllowance && token && address) {
      console.log('[Approval] Transaction confirmed, refetching allowance...');
      // Small delay to ensure blockchain state is updated after transaction confirmation
      const timeoutId = setTimeout(() => {
        refetchAllowance();
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isApproved, refetchAllowance, token, address]);

  const needsApproval =
    token &&
    token.symbol !== 'ETH' &&
    token.symbol !== 'WETH' &&
    allowance !== undefined &&
    allowance < amountNeeded;

  const handleApprove = async () => {
    if (!token || !address) return;
    
    approve({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [routerAddress, maxUint256],
    });
  };

  return {
    needsApproval,
    isLoadingAllowance,
    isApproving,
    isApproved,
    handleApprove,
  };
}

