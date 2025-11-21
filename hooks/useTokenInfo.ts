'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { Token } from '@uniswap/sdk-core';
import { isAddress } from 'viem';

// Standard ERC20 ABI for name, symbol, decimals
const ERC20_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useTokenInfo(contractAddress: string | null, chainId: number) {
  const [token, setToken] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidAddress = contractAddress ? isAddress(contractAddress) : false;

  // Fetch token name
  const { data: name, isLoading: isLoadingName, isError: isErrorName } = useReadContract({
    address: isValidAddress ? (contractAddress as `0x${string}`) : undefined,
    abi: ERC20_ABI,
    functionName: 'name',
    chainId,
    query: {
      enabled: isValidAddress,
      retry: 2,
    },
  });

  // Fetch token symbol
  const { data: symbol, isLoading: isLoadingSymbol, isError: isErrorSymbol } = useReadContract({
    address: isValidAddress ? (contractAddress as `0x${string}`) : undefined,
    abi: ERC20_ABI,
    functionName: 'symbol',
    chainId,
    query: {
      enabled: isValidAddress,
      retry: 2,
    },
  });

  // Fetch token decimals
  const { data: decimals, isLoading: isLoadingDecimals, isError: isErrorDecimals } = useReadContract({
    address: isValidAddress ? (contractAddress as `0x${string}`) : undefined,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId,
    query: {
      enabled: isValidAddress,
      retry: 2,
    },
  });

  const isLoading = isLoadingName || isLoadingSymbol || isLoadingDecimals;
  const hasError = isErrorName || isErrorSymbol || isErrorDecimals;

  useEffect(() => {
    if (!contractAddress || !isValidAddress) {
      setToken(null);
      setError(null);
      return;
    }

    // Check for errors
    if (hasError) {
      setError('Invalid token contract or not an ERC20 token');
      setToken(null);
      return;
    }

    // Wait for all data to be fetched
    if (!isLoading && name && symbol && decimals !== undefined) {
      try {
        const tokenInstance = new Token(
          chainId,
          contractAddress as `0x${string}`,
          Number(decimals),
          symbol as string,
          name as string
        );
        setToken(tokenInstance);
        setError(null);
      } catch (err) {
        setError('Failed to create token instance');
        setToken(null);
      }
    }
  }, [contractAddress, chainId, name, symbol, decimals, isValidAddress, isLoading, hasError]);

  return {
    token,
    isLoading,
    error,
    isValidAddress,
  };
}

