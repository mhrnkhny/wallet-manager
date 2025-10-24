'use client';

import React, { useState } from 'react';
import moment from 'moment-jalaali';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../animations/AnimationConfig';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  helperText,
  error,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const shouldReduceMotion = prefersReducedMotion();

  const getDaysInMonth = () => {
    const startOfMonth = moment(currentMonth).startOf('jMonth');
    const endOfMonth = moment(currentMonth).endOf('jMonth');
    const days = [];

    // Get first day of week (6 = Saturday, 0 = Sunday in moment)
    const firstDayOfWeek = startOfMonth.day();

    // Calculate empty cells before month starts
    // In Persian calendar: Saturday=0, Sunday=1, ..., Friday=6
    // In moment.js: Sunday=0, Monday=1, ..., Saturday=6
    // We need to convert: Saturday(6) -> 0, Sunday(0) -> 1, ..., Friday(5) -> 6
    const persianFirstDay = firstDayOfWeek === 6 ? 0 : firstDayOfWeek + 1;

    // Add empty cells for days before month starts
    for (let i = 0; i < persianFirstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= endOfMonth.jDate(); day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = moment(currentMonth).jDate(day);
    // Return Gregorian date in YYYY-MM-DD format for database storage
    onChange(selectedDate.format('YYYY-MM-DD'));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'jMonth'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'jMonth'));
  };

  const goToToday = () => {
    setCurrentMonth(moment());
    // Return Gregorian date in YYYY-MM-DD format for database storage
    onChange(moment().format('YYYY-MM-DD'));
    setIsOpen(false);
  };

  const clearDate = () => {
    onChange('');
    setIsOpen(false);
  };

  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']; // شنبه تا جمعه

  // Convert Gregorian date (YYYY-MM-DD) to Jalali for display
  const getDisplayValue = () => {
    if (!value) return placeholder;
    const date = moment(value, 'YYYY-MM-DD');
    return date.isValid() ? date.format('jYYYY/jMM/jDD') : value;
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex items-center gap-3 px-4 py-3 bg-dark-card rounded-2xl border-2 transition-all duration-200 cursor-pointer
          ${error ? 'border-error-500' : isOpen ? 'border-primary-500' : 'border-gray-700/50 hover:border-gray-600'}
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        {/* Calendar Icon */}
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        {/* Label and Value */}
        <div className="flex-1 min-w-0">
          {label && (
            <label className="block text-xs text-gray-400 mb-1">
              {label}
            </label>
          )}
          <p className={`text-sm ${value ? 'text-white' : 'text-gray-500'}`}>
            {getDisplayValue()}
          </p>
        </div>

        {/* Clear Button */}
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearDate();
            }}
            className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Dropdown Arrow */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p className={`mt-1 text-xs ${error ? 'text-error-500' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}

      {/* Calendar Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[100]"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-dark-surface rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
              style={{ width: '360px' }}
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="p-4 bg-dark-card border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <p className="text-white font-bold">
                  {currentMonth.format('jMMMM jYYYY')}
                </p>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={goToToday}
                  className="flex-1 px-3 py-1.5 text-xs bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                >
                  امروز
                </button>
                <button
                  onClick={clearDate}
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  پاک کردن
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Week Days */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-bold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayDate = moment(currentMonth).jDate(day);
                  const isSelected = value === dayDate.format('jYYYY/jMM/jDD');
                  const isToday = dayDate.format('jYYYY/jMM/jDD') === moment().format('jYYYY/jMM/jDD');

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      className={`
                        aspect-square rounded-xl text-sm font-semibold transition-all flex items-center justify-center min-h-[40px]
                        ${isSelected
                          ? 'bg-primary-500 text-white shadow-lg scale-105'
                          : isToday
                            ? 'bg-primary-500/20 text-primary-400 border-2 border-primary-500/50'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:scale-105'
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
