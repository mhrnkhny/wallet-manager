'use client';

import React from 'react';
import IconButton from '../ui/IconButton';

export interface AppBarProps {
  title?: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  showMenuButton?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({
  title = 'بانک من',
  onMenuClick,
  actions,
  showMenuButton = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-dark-surface/95 backdrop-blur-lg shadow-xl border-b border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Right side: Logo/Title + Menu Button */}
          <div className="flex items-center gap-3">
            {/* Menu button (mobile only) */}
            {showMenuButton && (
              <IconButton
                onClick={onMenuClick}
                aria-label="منوی ناوبری"
                className="lg:hidden"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </IconButton>
            )}

            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>

          {/* Left side: Actions */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;
