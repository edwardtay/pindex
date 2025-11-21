'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { TokenInput } from './TokenInput';
import { SwapButton } from './SwapButton';
import { useUniswapSwap } from '@/hooks/useUniswapSwap';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useGasEstimate } from '@/hooks/useGasEstimate';
import { usePriceImpact } from '@/hooks/usePriceImpact';
import { Token } from '@uniswap/sdk-core';
import { getETHToken, getUSDCToken } from '@/utils/tokens';
import { getSwapRouterAddress } from '@/utils/constants';

export function SwapInterface() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [slippage, setSlippage] = useState(0.5); // Default 0.5% slippage
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const isFetchingRef = useRef(false); // Prevent concurrent quote fetches

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set default tokens: ETH and USDC when chainId is available
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const ethToken = getETHToken(chainId);
      const usdcToken = getUSDCToken(chainId);
      
      if (!tokenIn || tokenIn.chainId !== chainId) {
        setTokenIn(ethToken);
      }
      if (!tokenOut || tokenOut.chainId !== chainId) {
        setTokenOut(usdcToken);
      }
    } catch (e) {
      console.error('Error setting default tokens:', e);
    }
  }, [chainId, mounted]);

  const { getQuote, executeSwap, loading, error, isSuccess } = useUniswapSwap();
  const { balance: balanceIn } = useTokenBalance(tokenIn);
  const { needsApproval, handleApprove, isApproving, isApproved } = useTokenApproval(tokenIn, amountIn);
  
  // Gas estimation - use Uniswap router
  const routerAddress = getSwapRouterAddress(chainId);
  const { estimatedCost, estimatedCostUSD, isLoading: isLoadingGas } = useGasEstimate({
    enabled: isConnected && !!tokenIn && !!tokenOut && parseFloat(amountIn) > 0 && !needsApproval && !!routerAddress,
    tokenIn,
    tokenOut,
    amountIn,
    routerAddress,
  });

  // Price impact calculation
  const { priceImpact, impactLevel, impactColor, hasWarning } = usePriceImpact({
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
  });

  // Handle max button click
  const handleMaxClick = useCallback(() => {
    if (balanceIn && parseFloat(balanceIn) > 0) {
      // Leave a small amount for gas (0.01 ETH or equivalent)
      const gasBuffer = tokenIn?.symbol === 'ETH' ? 0.01 : 0;
      const maxAmount = Math.max(0, parseFloat(balanceIn) - gasBuffer);
      setAmountIn(maxAmount.toString());
    }
  }, [balanceIn, tokenIn]);

  // Fetch quote with optimized debouncing and request cancellation
  useEffect(() => {
    if (!mounted) return;
    
    // Guard: prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('[Quote] Already fetching, skipping duplicate request');
      return;
    }
    
    if (amountIn && tokenIn && tokenOut && parseFloat(amountIn) > 0) {
      setIsFetchingQuote(true);
      setQuoteError(null);
      
      let cancelled = false;
      
      // Debounce to 300ms to avoid excessive requests
      const timeoutId = setTimeout(async () => {
        // Double-check we're not already fetching
        if (isFetchingRef.current) {
          console.log('[Quote] Concurrent fetch detected, cancelling');
          return;
        }
        
        isFetchingRef.current = true;
        
        try {
          console.log(`[Quote] Fetching quote: ${amountIn} ${tokenIn.symbol} → ${tokenOut.symbol}`);
          const quote = await getQuote(tokenIn, tokenOut, amountIn);
          
          // Check if request was cancelled (user changed input)
          if (cancelled) {
            console.log('[Quote] Request cancelled, ignoring result');
            return;
          }
          
          if (quote && parseFloat(quote) > 0) {
            console.log(`[Quote] ✓ Received quote: ${quote} ${tokenOut.symbol}`);
            setAmountOut(quote);
            setQuoteError(null);
          } else {
            console.warn('[Quote] Invalid quote received:', quote);
            // getQuote should always return a valid quote, but handle edge case
            setAmountOut('0.0');
            setQuoteError('Unable to get quote. Please try again.');
          }
        } catch (err) {
          if (cancelled) return;
          
          console.error('[Quote] Error:', err);
          // getQuote has fallback logic, so this shouldn't happen often
          setAmountOut('0.0');
          setQuoteError('Quote fetch failed. Please try again.');
        } finally {
          isFetchingRef.current = false;
          if (!cancelled) {
            setIsFetchingQuote(false);
          }
        }
      }, 300); // 300ms debounce

      return () => {
        cancelled = true;
        isFetchingRef.current = false;
        clearTimeout(timeoutId);
      };
    } else {
      setAmountOut('');
      setQuoteError(null);
      setIsFetchingQuote(false);
      isFetchingRef.current = false;
    }
  }, [amountIn, tokenIn?.address, tokenOut?.address, getQuote, mounted]);

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn || !isConnected) return;
    
    // If approval needed, approve first
    if (needsApproval) {
      await handleApprove();
      return;
    }
    
    try {
      await executeSwap(tokenIn, tokenOut, amountIn, slippage);
    } catch (err) {
      console.error('Swap failed:', err);
    }
  };

  // Reset form on successful swap
  useEffect(() => {
    if (isSuccess) {
      setAmountIn('');
      setAmountOut('');
    }
  }, [isSuccess]);

  return (
    <div className="card">
      <div style={{ marginBottom: '1rem' }}>
        <TokenInput
          label="From"
          token={tokenIn}
          amount={amountIn}
          onTokenChange={setTokenIn}
          onAmountChange={setAmountIn}
          chainId={chainId}
          showBalance={isConnected}
          onMaxClick={handleMaxClick}
        />
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button
          onClick={() => {
            const tempToken = tokenIn;
            const tempAmount = amountIn;
            setTokenIn(tokenOut);
            setTokenOut(tempToken);
            setAmountIn(amountOut);
            setAmountOut(tempAmount);
          }}
          style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          ⇅
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <TokenInput
          label="To"
          token={tokenOut}
          amount={isFetchingQuote ? '...' : (amountOut || '0.0')}
          onTokenChange={setTokenOut}
          onAmountChange={setAmountOut}
          chainId={chainId}
          readOnly
          showBalance={isConnected}
        />
      </div>

      {/* Quote Error */}
      {quoteError && (
        <div
          style={{
            padding: '10px',
            background: 'rgba(253, 64, 64, 0.1)',
            border: '1px solid var(--error-color)',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '12px',
            color: 'var(--error-color)',
          }}
        >
          ⚠️ {quoteError}
        </div>
      )}

      {/* Price Impact Warning */}
      {hasWarning && priceImpact !== null && (
        <div
          style={{
            padding: '10px',
            background: impactLevel === 'high' ? 'rgba(253, 64, 64, 0.1)' : 'rgba(255, 165, 0, 0.1)',
            border: `1px solid ${impactColor}`,
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '12px',
            color: impactColor,
          }}
        >
          ⚠️ Price Impact: {priceImpact.toFixed(2)}% - {impactLevel === 'high' ? 'High impact detected' : 'Moderate impact'}
        </div>
      )}

      {/* Gas Estimation */}
      {estimatedCost && isConnected && !needsApproval && (
        <div
          style={{
            padding: '10px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Estimated Gas:</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {parseFloat(estimatedCost).toFixed(6)} ETH
              {estimatedCostUSD && ` (~$${estimatedCostUSD})`}
            </span>
          </div>
        </div>
      )}


      {/* Slippage Settings */}
      <div style={{ marginBottom: '1rem', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Slippage Tolerance:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0.1, 0.5, 1.0].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                style={{
                  padding: '4px 8px',
                  background: slippage === val ? 'var(--primary-color)' : 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: slippage === val ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '12px',
            background: 'rgba(253, 64, 64, 0.1)',
            border: '1px solid var(--error-color)',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: 'var(--error-color)',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {isSuccess && (
        <div
          style={{
            padding: '12px',
            background: 'rgba(39, 174, 96, 0.1)',
            border: '1px solid var(--success-color)',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: 'var(--success-color)',
            fontSize: '14px',
          }}
        >
          Swap successful! 🎉
        </div>
      )}

      <SwapButton
        onClick={handleSwap}
        disabled={
          !isConnected ||
          !tokenIn ||
          !tokenOut ||
          !amountIn ||
          !amountOut ||
          parseFloat(amountOut) <= 0 ||
          loading ||
          isApproving ||
          isFetchingQuote ||
          parseFloat(amountIn) <= 0
        }
        loading={loading || isApproving}
        text={needsApproval ? 'Approve Token' : 'Swap'}
      />
    </div>
  );
}

