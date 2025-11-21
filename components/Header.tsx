'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Web3Modal is optional - we'll use direct connectors if not available
  // This avoids the hook initialization error when Web3Modal isn't configured
  
  const [showInfo, setShowInfo] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo size="medium" showTagline={false} />
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-color)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            aria-label="About PinDex"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          {showInfo && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: '32px',
                  left: '0',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '16px',
                  minWidth: '320px',
                  maxWidth: '400px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  About PinDex
                </h3>
                <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>
                  PinDex is a decentralized DEX frontend for Uniswap, deployed via PinMe to ENS and IPFS.
                </p>
                <ul
                  style={{
                    margin: '0 0 12px 0',
                    paddingLeft: '20px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <li>Fully decentralized - no central servers</li>
                  <li>Tamper-proof content delivery via IPFS</li>
                  <li>Censorship resistant</li>
                  <li>Direct Uniswap V3 integration</li>
                </ul>
                <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.7 }}>
                  Built for the decentralized web 🌐
                </p>
              </div>
              <div
                onClick={() => setShowInfo(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
              />
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <ThemeToggle />
        {!mounted ? (
          // Render placeholder during SSR to prevent hydration mismatch
          <button
            className="button"
            style={{ width: 'auto', padding: '10px 20px' }}
            disabled
          >
            Connect Wallet
          </button>
        ) : isConnected ? (
          <button
            onClick={() => disconnect()}
            className="button"
            style={{ width: 'auto', padding: '10px 20px' }}
          >
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </button>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              onClick={async () => {
                try {
                  setConnectionError(null);
                  
                  // Use direct wagmi connectors (works without Web3Modal)
                  // Web3Modal support can be added later if needed
                  const availableConnectors = connectors.filter(c => c.ready);
                  console.log('Available connectors:', availableConnectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));
                  
                  // Check for Brave wallet specifically
                  const braveDetected = typeof window !== 'undefined' && 
                    ((window as any).ethereum?.isBraveWallet || 
                     (window as any).brave?.ethereum ||
                     (window as any).ethereum?.providers?.some((p: any) => p.isBraveWallet));
                  
                  console.log('Brave wallet detected:', braveDetected);
                  console.log('window.ethereum:', typeof window !== 'undefined' ? (window as any).ethereum : 'N/A');
                  
                  if (availableConnectors.length > 0) {
                    // Try Brave connector first if detected
                    let connectorToUse = availableConnectors.find(
                      c => c.name.toLowerCase().includes('brave')
                    );
                    
                    // Then try MetaMask
                    if (!connectorToUse) {
                      connectorToUse = availableConnectors.find(
                        c => c.name.toLowerCase().includes('metamask')
                      );
                    }
                    
                    // Then try any injected connector
                    if (!connectorToUse) {
                      connectorToUse = availableConnectors.find(
                        c => c.id === 'injected' || c.name.toLowerCase().includes('injected')
                      );
                    }
                    
                    // Fallback to first available
                    if (!connectorToUse) {
                      connectorToUse = availableConnectors[0];
                    }
                    
                    if (connectorToUse) {
                      console.log('Connecting with:', connectorToUse.name);
                      connect({ connector: connectorToUse });
                    } else {
                      setConnectionError('No wallet connector available');
                    }
                  } else {
                    // Fallback: try direct window.ethereum connection
                    if (typeof window !== 'undefined' && (window as any).ethereum) {
                      try {
                        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                        // If successful, try connecting with injected connector again
                        const injectedConn = connectors.find(c => c.id === 'injected');
                        if (injectedConn && injectedConn.ready) {
                          connect({ connector: injectedConn });
                        }
                      } catch (ethErr: any) {
                        console.error('Direct ethereum connection failed:', ethErr);
                        setConnectionError('Please unlock your Brave wallet and try again.');
                      }
                    } else {
                      setConnectionError('No wallet detected. Please enable Brave wallet or install MetaMask.');
                    }
                  }
                } catch (err: any) {
                  console.error('Connection error:', err);
                  setConnectionError(err?.message || 'Failed to connect wallet');
                }
              }}
              className="button"
              style={{ width: 'auto', padding: '10px 20px' }}
              disabled={isPending}
            >
              {isPending ? 'Connecting...' : 'Connect Wallet'}
            </button>
            
            {(connectionError || connectError) && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '8px',
                padding: '8px 12px',
                background: 'var(--surface-color)',
                border: '1px solid var(--error-color)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--error-color)',
                zIndex: 1001,
                whiteSpace: 'nowrap',
                maxWidth: '300px',
              }}>
                {connectionError || connectError?.message || 'Connection failed'}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

