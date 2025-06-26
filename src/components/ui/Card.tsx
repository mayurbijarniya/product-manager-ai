import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const baseClasses = 'bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-light dark:shadow-dark';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const interactiveClasses = hover || onClick ? 'transition-all duration-200 hover:shadow-light-lg dark:hover:shadow-dark-lg cursor-pointer hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-primary-800' : '';

  return (
    <div
      className={clsx(
        baseClasses,
        paddingClasses[padding],
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};