'use client';

interface TokenDisplayProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

export function TokenDisplay({ count, size = 'md' }: TokenDisplayProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span className={`${sizes[size]} text-yellow-400`}>
      {Array(count).fill(null).map((_, i) => (
        <span key={i} title="Token">🪙</span>
      ))}
      {count === 0 && <span className="text-gray-500">No tokens</span>}
    </span>
  );
}
