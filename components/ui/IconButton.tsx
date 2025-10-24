import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary' | 'error';
  'aria-label': string; // Required for accessibility
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = 'medium',
      color = 'default',
      className = '',
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      small: 'w-8 h-8 p-1',
      medium: 'w-10 h-10 p-2',
      large: 'w-12 h-12 p-3',
    };

    // Color classes - Dark Theme
    const colorClasses = {
      default: 'text-gray-400 hover:bg-dark-bg hover:text-white active:bg-gray-700',
      primary: 'text-primary-400 hover:bg-primary-600/20 hover:text-primary-300 active:bg-primary-600/30',
      secondary: 'text-secondary-400 hover:bg-secondary-600/20 hover:text-secondary-300 active:bg-secondary-600/30',
      error: 'text-error-400 hover:bg-error-600/20 hover:text-error-300 active:bg-error-600/30',
    };

    const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
