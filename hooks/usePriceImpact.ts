'use client';

import { useMemo } from 'react';
import { Token } from '@uniswap/sdk-core';
import { parseUnits, formatUnits } from 'viem';

interface UsePriceImpactProps {
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
  amountOut: string;
  expectedAmountOut?: string; // Expected amount without impact
}

export function usePriceImpact({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  expectedAmountOut,
}: UsePriceImpactProps) {
  const priceImpact = useMemo(() => {
    if (!tokenIn || !tokenOut || !amountIn || !amountOut || parseFloat(amountIn) === 0) {
      return null;
    }

    const amountInNum = parseFloat(amountIn);
    const amountOutNum = parseFloat(amountOut);
    
    if (amountOutNum === 0) return null;

    // Calculate expected output based on simple price ratio
    // In production, this would use pool reserves
    const expected = expectedAmountOut 
      ? parseFloat(expectedAmountOut)
      : amountOutNum; // Fallback to current quote

    if (expected === 0) return null;

    // Price impact = (expected - actual) / expected
    const impact = ((expected - amountOutNum) / expected) * 100;
    
    return impact;
  }, [tokenIn, tokenOut, amountIn, amountOut, expectedAmountOut]);

  const impactLevel = useMemo(() => {
    if (priceImpact === null) return null;
    if (priceImpact < 0.5) return 'low';
    if (priceImpact < 1.0) return 'medium';
    return 'high';
  }, [priceImpact]);

  const impactColor = useMemo(() => {
    if (!impactLevel) return 'var(--text-secondary)';
    if (impactLevel === 'low') return 'var(--success-color)';
    if (impactLevel === 'medium') return '#ffa500';
    return 'var(--error-color)';
  }, [impactLevel]);

  return {
    priceImpact,
    impactLevel,
    impactColor,
    hasWarning: priceImpact !== null && priceImpact > 0.5,
  };
}

