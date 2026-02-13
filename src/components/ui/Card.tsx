'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl ${
        onClick ? 'cursor-pointer glass-panel-hover' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
