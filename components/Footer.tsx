'use client';

export function Footer() {
  return (
    <footer
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginTop: '4rem',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--primary-color)' }}>🌐</span>
          <span>ENS: decentralizedlife.eth</span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--secondary-color)' }}>📦</span>
          <span>IPFS: Decentralized</span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--success-color)' }}>🔒</span>
          <span>Content-Hash Verified</span>
        </div>
      </div>
      <p>
        <a
          href="https://decentralizedlife.eth.limo/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = 'var(--primary-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          PinDEX
        </a>{' '}
        🚀 - Fully Decentralized DEX | Made by{' '}
        <a
          href="https://edwardtay.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Edward
        </a>
      </p>
      <p style={{ marginTop: '8px', fontSize: '12px' }}>
        Built for PinMe DeFront Hack | Censorship Resistant | Tamper Proof
      </p>
    </footer>
  );
}

