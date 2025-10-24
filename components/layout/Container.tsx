import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  padding = true,
  className = '',
  children,
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  const combinedClasses = `mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
