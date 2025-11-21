'use client';

import { useState, useMemo } from 'react';
import { Token } from '@uniswap/sdk-core';
import { COMMON_TOKENS, getETHToken } from '@/utils/tokens';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { isAddress } from 'viem';

interface TokenSelectorProps {
  chainId: number;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export function TokenSelector({ chainId, onSelect, onClose }: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const tokens = COMMON_TOKENS[chainId] || [];
  
  // Add ETH as first option (using WETH for swaps)
  const ethToken = (() => {
    try {
      return getETHToken(chainId);
    } catch {
      return null;
    }
  })();
  
  const allTokens = ethToken ? [ethToken, ...tokens.filter(t => t.symbol !== 'WETH')] : tokens;

  // Check if search query is an address
  const isAddressQuery = isAddress(searchQuery.trim());

  // Handle custom token address lookup when user enters an address
  const { token: customToken, isLoading: isLoadingCustom, error: customError } = useTokenInfo(
    isAddressQuery ? searchQuery.trim() : null,
    chainId
  );

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return allTokens;
    
    // If it's an address query, don't filter - show custom token result instead
    if (isAddressQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return allTokens.filter(
      (token) =>
        token.symbol?.toLowerCase().includes(query) ||
        token.name?.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    );
  }, [allTokens, searchQuery, isAddressQuery]);

  const handleCustomTokenSelect = () => {
    if (customToken) {
      onSelect(customToken);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: '450px', maxHeight: '80vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3>Select Token</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '24px',
            }}
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, symbol, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ marginBottom: '1rem', fontSize: '14px' }}
        />

        {/* Show custom token result when address is entered */}
        {isAddressQuery && (
          <div style={{ marginBottom: '1rem', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {customError && (
              <div style={{ color: 'var(--error-color)', fontSize: '12px', marginBottom: '8px' }}>
                {customError}
              </div>
            )}
            {isLoadingCustom && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>
                Loading token info...
              </div>
            )}
            {customToken && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>{customToken.symbol}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', opacity: 0.85 }}>{customToken.name}</div>
                <button
                  onClick={handleCustomTokenSelect}
                  className="button"
                  style={{ marginTop: '8px', width: '100%', padding: '8px' }}
                >
                  Select {customToken.symbol}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Token List */}
        {!isAddressQuery && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredTokens.length === 0 && searchQuery ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No tokens found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                style={{
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-color)';
                }}
              >
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{token.symbol || 'Unknown'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', opacity: 0.85 }}>
                  {token.name || 'Unknown Token'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-primary)', opacity: 0.7, marginTop: '4px', fontFamily: 'Arial, sans-serif' }}>
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </div>
              </button>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
}
