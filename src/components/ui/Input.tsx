'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 glass-panel rounded-xl text-text-primary placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-neon-cyan/40 focus:border-neon-cyan/50 transition-all ${
            error ? 'border-neon-red/50 focus:ring-neon-red/40' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-neon-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
