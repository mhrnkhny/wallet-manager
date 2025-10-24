import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorText,
      fullWidth = false,
      options,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = `${selectId}-helper`;
    const errorTextId = `${selectId}-error`;

    const widthClass = fullWidth ? 'w-full' : '';

    const selectClasses = `
      w-full px-4 py-3 text-base rounded-2xl
      border-2 ${error ? 'border-error-500' : 'border-gray-600/30'}
      bg-dark-surface text-white
      appearance-none
      transition-all duration-200
      focus:outline-none
      ${error ? 'focus:border-error-500 focus:ring-2 focus:ring-error-500/20' : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'}
      disabled:bg-gray-800 disabled:border-gray-700 disabled:cursor-not-allowed disabled:text-gray-500
      pr-10
    `.trim();

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
            className={`block text-sm font-medium mb-2 ${
              error ? 'text-error-500' : 'text-gray-300'
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            aria-invalid={error}
            aria-describedby={
              error && errorText
                ? errorTextId
                : helperText
                ? helperTextId
                : undefined
            }
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-dark-surface text-white">
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown icon */}
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            error ? 'text-error-500' : 'text-gray-400'
          }`}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && errorText && (
          <p
            id={errorTextId}
            className="mt-2 text-sm text-error-500 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorText}
          </p>
        )}

        {!error && helperText && (
          <p id={helperTextId} className="mt-2 text-sm text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
