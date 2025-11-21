'use client';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export function Logo({ size = 'medium', showTagline = true }: LogoProps) {
  const sizeStyles = {
    small: { fontSize: '20px', lineHeight: '1.2' },
    medium: { fontSize: '32px', lineHeight: '1.2' },
    large: { fontSize: '48px', lineHeight: '1.2' },
  };

  const taglineStyles = {
    small: { fontSize: '10px', marginTop: '2px' },
    medium: { fontSize: '12px', marginTop: '4px' },
    large: { fontSize: '14px', marginTop: '6px' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div
        style={{
          ...sizeStyles[size],
          fontWeight: 700,
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '-0.02em',
          position: 'relative',
          display: 'inline-block',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <span 
          style={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'inline-block',
            transform: 'rotate(-2deg)',
            background: 'linear-gradient(135deg, #ff007a 0%, #2172e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Pin
        </span>
        <span
          style={{
            background: 'linear-gradient(135deg, #2172e5 0%, #ff007a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            position: 'relative',
            zIndex: 1,
            display: 'inline-block',
            transform: 'rotate(1deg)',
            marginLeft: '-1px',
          }}
        >
          DEX
        </span>
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-12px',
            fontSize: '0.4em',
            opacity: 0.3,
            zIndex: 0,
            pointerEvents: 'none',
            transform: 'rotate(15deg)',
          }}
        >
          ⚡
        </span>
      </div>
      {showTagline && (
        <p
          style={{
            ...taglineStyles[size],
            color: 'var(--text-secondary)',
            marginTop: taglineStyles[size].marginTop,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Decentralized DEX
        </p>
      )}
    </div>
  );
}

