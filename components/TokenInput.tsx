'use client';

import { Token } from '@uniswap/sdk-core';
import { useState } from 'react';
import { TokenSelector } from './TokenSelector';
import { useTokenBalance } from '@/hooks/useTokenBalance';

interface TokenInputProps {
  label: string;
  token: Token | null;
  amount: string;
  onTokenChange: (token: Token | null) => void;
  onAmountChange: (amount: string) => void;
  chainId: number;
  readOnly?: boolean;
  showBalance?: boolean;
  onMaxClick?: () => void;
}

export function TokenInput({
  label,
  token,
  amount,
  onTokenChange,
  onAmountChange,
  chainId,
  readOnly = false,
  showBalance = false,
  onMaxClick,
}: TokenInputProps) {
  const [showSelector, setShowSelector] = useState(false);
  const { balance, isLoading: isLoadingBalance } = useTokenBalance(token);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label className="label" style={{ marginBottom: 0 }}>{label}</label>
        {showBalance && token && (
          <div style={{ fontSize: '12px', color: 'var(--text-primary)', opacity: 0.9 }}>
            Balance: {isLoadingBalance ? '...' : balance} {token.symbol}
            {onMaxClick && !readOnly && (
              <button
                onClick={onMaxClick}
                style={{
                  marginLeft: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textDecoration: 'underline',
                }}
              >
                Max
              </button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setShowSelector(true)}
          style={{
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            minWidth: '140px',
            textAlign: 'left',
          }}
        >
          {token ? (
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{token.symbol}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', opacity: 0.8 }}>
                {token.name}
              </div>
            </div>
          ) : (
            'Select Token'
          )}
        </button>
        <input
          type="number"
          className="input"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          readOnly={readOnly}
          style={{ flex: 1 }}
        />
      </div>
      {showSelector && (
        <TokenSelector
          chainId={chainId}
          onSelect={(selectedToken) => {
            onTokenChange(selectedToken);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}

