'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, transitions } from '../animations/AnimationConfig';

export interface BankCardProps {
  cardNumber: string;
  bankName: string;
  cardHolderName: string;
  cardTitle?: string;
  cvv2?: string;
  shebaNumber?: string;
  expiryDate?: string;
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

const BankCard: React.FC<BankCardProps> = ({
  cardNumber,
  bankName,
  cardHolderName,
  cardTitle,
  cvv2,
  shebaNumber,
  expiryDate = '08/29',
  variant = 'default',
  onClick,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const shouldReduceMotion = prefersReducedMotion();

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleHover = () => {
    if (!shouldReduceMotion && variant === 'default') {
      setIsFlipped(true);
    }
  };

  const handleHoverEnd = () => {
    if (!shouldReduceMotion && variant === 'default') {
      setIsFlipped(false);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className="relative overflow-hidden rounded-3xl p-5 text-white shadow-2xl cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #60A5FA 100%)',
        }}
        onClick={onClick}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                y: -4,
                boxShadow: '0 20px 40px -10px rgba(167, 139, 250, 0.4)',
                transition: transitions.fast,
              }
        }
        transition={transitions.spring}
      >
        {/* Card Title */}
        {cardTitle && (
          <div className="mb-3">
            <p className="text-xs opacity-70 mb-0.5">عنوان کارت</p>
            <p className="text-sm font-bold">{cardTitle}</p>
          </div>
        )}

        {/* Bank Name and Card Number */}
        <div className="space-y-2 mb-3">
          <p className="text-xs opacity-90 font-medium">{bankName}</p>
          <p className="font-mono text-base font-bold tracking-wider">
            {formatCardNumber(cardNumber)}
          </p>
        </div>

        {/* Sheba Number */}
        {shebaNumber && (
          <div className="mb-3">
            <p className="text-xs opacity-70 mb-0.5">شماره شبا</p>
            <p className="font-mono text-xs opacity-90">IR{shebaNumber}</p>
          </div>
        )}

        {/* Bottom Row: Cardholder Name and Expiry */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs opacity-70 mb-0.5">صاحب کارت</p>
            <p className="text-xs font-medium">{cardHolderName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70 mb-0.5">تاریخ انقضا</p>
            <p className="text-xs font-mono font-bold">{expiryDate}</p>
          </div>
        </div>

        {/* Chip Icon */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center">
          <div className="w-6 h-5 rounded bg-white/20 border border-white/20" />
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className="relative"
      style={{ perspective: '1000px' }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      {/* Stacked Cards Effect - Background Cards */}
      <div className="absolute top-2 left-2 right-2 h-full">
        <div
          className="w-full h-full rounded-3xl opacity-60"
          style={{
            background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
            transform: 'translateY(-8px) scale(0.95)',
          }}
        />
      </div>
      <div className="absolute top-1 left-1 right-1 h-full">
        <div
          className="w-full h-full rounded-3xl opacity-80"
          style={{
            background: 'linear-gradient(135deg, #F472B6 0%, #C084FC 100%)',
            transform: 'translateY(-4px) scale(0.97)',
          }}
        />
      </div>

      <motion.div
        className="relative w-full"
        style={{
          aspectRatio: '1.586/1',
          transformStyle: 'preserve-3d',
        }}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                rotateY: isFlipped ? 180 : 0,
              }
        }
        transition={transitions.spring}
      >
        {/* Front of card */}
        <motion.div
          className={`absolute inset-0 overflow-hidden rounded-3xl p-6 text-white shadow-2xl ${
            onClick ? 'cursor-pointer' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #60A5FA 100%)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: '0 20px 60px -10px rgba(167, 139, 250, 0.5)',
          }}
          onClick={onClick}
          whileHover={
            shouldReduceMotion
              ? {}
              : {
                  boxShadow: '0 25px 70px -15px rgba(167, 139, 250, 0.6)',
                }
          }
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Bank name and chip */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold tracking-wide">{bankName}</p>
              </div>

              {/* Plus Icon (like in design) */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Card Title if provided */}
            {cardTitle && (
              <div className="mb-4">
                <p className="text-xs opacity-70">عنوان کارت</p>
                <p className="text-lg font-bold">{cardTitle}</p>
              </div>
            )}

            {/* Cardholder Name and Expiry */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-right">
                <p className="text-xs opacity-70">صاحب کارت</p>
                <p className="text-sm font-medium opacity-90">{cardHolderName}</p>
              </div>
              <div className="text-left">
                <p className="text-xs opacity-70">تاریخ انقضا</p>
                <p className="text-sm font-mono font-bold">{expiryDate}</p>
              </div>
            </div>

            {/* Card number */}
            <div>
              <p className="font-mono text-xl sm:text-2xl font-bold tracking-widest">
                {formatCardNumber(cardNumber)}
              </p>
            </div>

            {/* Contactless icon */}
            <div className="absolute bottom-28 right-6">
              <svg className="w-8 h-8 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
                <path d="M4.93 5.82C3.08 7.34 2 9.61 2 12s1.08 4.66 2.93 6.18L6.34 16c-1.13-1.02-1.84-2.48-1.84-4.1s.71-3.08 1.84-4.1l-1.41-1.98zM8.17 9.59C7.45 10.27 7 11.1 7 12c0 .9.45 1.73 1.17 2.41l1.41-1.41c-.35-.34-.58-.81-.58-1.33 0-.52.23-.99.58-1.33L8.17 9.59z"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-3xl text-white shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #60A5FA 100%)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Magnetic strip */}
            <div className="h-12 bg-black/40 mt-6" />

            {/* CVV section */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="bg-white/95 rounded-xl p-4 text-gray-800 shadow-md">
                <p className="text-xs font-medium mb-1 text-gray-600">CVV2</p>
                <p className="font-mono text-xl font-bold tracking-wider">{cvv2 || '***'}</p>
              </div>

              {/* Sheba Number on back */}
              {shebaNumber && (
                <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs opacity-70 mb-1">شماره شبا</p>
                  <p className="font-mono text-xs font-medium">IR{shebaNumber}</p>
                </div>
              )}

              <div className="mt-4 space-y-1 text-white/80">
                <p className="text-xs">
                  این کارت متعلق به {cardHolderName} می‌باشد
                </p>
                <p className="text-xs">
                  لطفا از اشتراک اطلاعات کارت خودداری کنید
                </p>
              </div>

              {/* Signature panel */}
              <div className="mt-4 h-10 bg-white/90 rounded border-2 border-dashed border-white/30" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BankCard;
