'use client';

interface SwapButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  text?: string;
}

export function SwapButton({ onClick, disabled, loading, text = 'Swap' }: SwapButtonProps) {
  return (
    <button
      className="button"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Processing...' : text}
    </button>
  );
}

