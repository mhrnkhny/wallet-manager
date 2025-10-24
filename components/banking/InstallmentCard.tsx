'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/components/animations/AnimationConfig';
import moment from 'moment-jalaali';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import TextField from '@/components/ui/TextField';
import Snackbar from '@/components/ui/Snackbar';

interface Payment {
  id: number;
  payment_date: string;
  amount: number;
  note?: string;
}

interface BankCard {
  id: number;
  card_number: string;
  bank_name: string;
  card_holder_name: string;
  card_title?: string;
  balance: number;
}

interface InstallmentCardProps {
  id: number;
  installmentTitle: string;
  startDate: string;
  endDate: string;
  paymentDayOfMonth: number;
  totalAmount: number;
  installmentAmount: number;
  description?: string;
  paidCount?: number;
  totalPaid?: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onPaymentAdded?: () => void;
}

const InstallmentCard: React.FC<InstallmentCardProps> = ({
  id,
  installmentTitle,
  startDate,
  endDate,
  paymentDayOfMonth,
  totalAmount,
  installmentAmount,
  description,
  paidCount = 0,
  totalPaid = 0,
  onDelete,
  onEdit,
  onPaymentAdded,
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: '',
    amount: installmentAmount.toString(),
    note: '',
    cardId: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const formatCurrency = (amount: number) => {
    // Handle NaN, undefined, null cases
    if (amount == null || isNaN(amount)) {
      return '0';
    }
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = moment(dateString, 'YYYY-MM-DD');
    const formatted = date.isValid() ? date.format('jYYYY/jMM/jDD') : '-';
    return formatted;
  };

  const calculateMonths = () => {
    if (!startDate || !endDate) return 0;

    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');

    if (!start.isValid() || !end.isValid()) return 0;

    const months = end.diff(start, 'months') + 1;
    return months > 0 ? months : 0;
  };

  const totalMonths = calculateMonths();
  const remainingCount = totalMonths - paidCount;
  const progressPercentage = totalMonths > 0 ? (paidCount / totalMonths) * 100 : 0;

  const fetchBankCards = async () => {
    try {
      setLoadingCards(true);
      const response = await fetch('/api/cards');
      const data = await response.json();
      setBankCards(data.cards || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دریافت کارت‌های بانکی',
        severity: 'error',
      });
    } finally {
      setLoadingCards(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await fetch(`/api/installments/${id}/payments`);
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دریافت تاریخچه پرداخت‌ها',
        severity: 'error',
      });
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleShowHistory = () => {
    fetchPayments();
    setHistoryModalOpen(true);
  };

  const handleOpenPaymentModal = () => {
    fetchBankCards();
    setPaymentModalOpen(true);
  };

  const handleAddPayment = async () => {
    if (!paymentForm.paymentDate || !paymentForm.amount) {
      setSnackbar({
        open: true,
        message: 'لطفاً تاریخ و مبلغ را وارد کنید',
        severity: 'error',
      });
      return;
    }

    if (!paymentForm.cardId) {
      setSnackbar({
        open: true,
        message: 'لطفاً کارت بانکی را انتخاب کنید',
        severity: 'error',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/installments/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentDate: paymentForm.paymentDate,
          amount: parseFloat(paymentForm.amount),
          note: paymentForm.note,
          cardId: parseInt(paymentForm.cardId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ثبت پرداخت');
      }

      setSnackbar({
        open: true,
        message: 'پرداخت با موفقیت ثبت شد',
        severity: 'success',
      });

      setPaymentModalOpen(false);
      setPaymentForm({
        paymentDate: '',
        amount: installmentAmount.toString(),
        note: '',
        cardId: '',
      });

      if (onPaymentAdded) {
        onPaymentAdded();
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
        className="bg-dark-surface rounded-2xl p-5 border border-gray-700/50 hover:border-primary-500/30 transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{installmentTitle}</h3>
            {description && <p className="text-sm text-gray-400">{description}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(id)}
              className="p-2 hover:bg-primary-500/20 rounded-xl transition-colors text-primary-400"
              aria-label="ویرایش قسط"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 hover:bg-error-500/20 rounded-xl transition-colors text-error-400"
              aria-label="حذف قسط"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">پیشرفت پرداخت</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {paidCount} از {totalMonths} قسط
              </span>
              {remainingCount === 0 && (
                <span className="px-2 py-0.5 bg-success-500/20 text-success-400 rounded-lg text-xs font-medium">
                  تکمیل شده
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-success-500 to-success-400"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {remainingCount > 0 ? `${remainingCount} قسط باقی‌مانده` : 'تسویه شده'}
          </p>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-primary-500/10 rounded-xl p-3 border border-primary-500/20">
            <p className="text-xs text-primary-400 mb-1">مجموع کل</p>
            <p className="text-lg font-bold text-primary-300 direction-ltr text-right">
              {formatCurrency(totalAmount)}
              <span className="text-xs font-normal mr-1">ریال</span>
            </p>
          </div>
          <div className="bg-success-500/10 rounded-xl p-3 border border-success-500/20">
            <p className="text-xs text-success-400 mb-1">پرداخت شده</p>
            <p className="text-lg font-bold text-success-300 direction-ltr text-right">
              {formatCurrency(totalPaid)}
              <span className="text-xs font-normal mr-1">ریال</span>
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400">تاریخ:</span>
            <span className="text-white font-medium">{formatDate(startDate)} تا {formatDate(endDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">روز پرداخت:</span>
            <span className="text-white font-medium">{paymentDayOfMonth} هر ماه</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">هر قسط:</span>
            <span className="text-white font-medium">{formatCurrency(installmentAmount)} ریال</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`grid ${remainingCount === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {remainingCount > 0 && (
            <button
              onClick={handleOpenPaymentModal}
              className="px-4 py-2 bg-success-500/20 hover:bg-success-500/30 text-success-400 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ثبت پرداخت
            </button>
          )}
          <button
            onClick={handleShowHistory}
            className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            تاریخچه
          </button>
        </div>
      </motion.div>

      {/* Add Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="ثبت پرداخت قسط"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <DatePicker
            label="تاریخ پرداخت"
            value={paymentForm.paymentDate}
            onChange={(date) => setPaymentForm({ ...paymentForm, paymentDate: date })}
            placeholder="انتخاب تاریخ پرداخت"
            fullWidth
          />

          {/* Bank Card Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              کارت بانکی
            </label>
            {loadingCards ? (
              <div className="px-4 py-3 text-center text-gray-400 bg-dark-card rounded-2xl border-2 border-gray-700/50">
                در حال بارگذاری کارت‌ها...
              </div>
            ) : bankCards.length === 0 ? (
              <div className="px-4 py-3 text-center text-gray-400 bg-dark-card rounded-2xl border-2 border-gray-700/50">
                هیچ کارت بانکی یافت نشد
              </div>
            ) : (
              <select
                value={paymentForm.cardId}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardId: e.target.value })}
                className="w-full px-4 py-3 text-base rounded-2xl border-2 border-gray-600/30 bg-dark-surface text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              >
                <option value="">انتخاب کارت بانکی</option>
                {bankCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.card_title || card.bank_name} - {card.card_number.slice(-4)} - موجودی: {formatCurrency(card.balance)} ریال
                  </option>
                ))}
              </select>
            )}
          </div>

          <TextField
            label="مبلغ پرداختی (ریال)"
            value={paymentForm.amount}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPaymentForm({ ...paymentForm, amount: value });
            }}
            fullWidth
            helperText={paymentForm.amount ? formatCurrency(parseInt(paymentForm.amount)) + ' ریال' : ''}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              یادداشت (اختیاری)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 text-base rounded-2xl border-2 border-gray-600/30 bg-dark-surface text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              value={paymentForm.note}
              onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
              placeholder="یادداشت درباره این پرداخت..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="filled"
              color="success"
              fullWidth
              onClick={handleAddPayment}
              loading={submitting}
            >
              ثبت پرداخت
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setPaymentModalOpen(false)}
              disabled={submitting}
            >
              انصراف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment History Modal */}
      <Modal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`تاریخچه پرداخت‌های ${installmentTitle}`}
        maxWidth="md"
      >
        <div className="space-y-3">
          {loadingPayments ? (
            <div className="text-center py-8 text-gray-400">در حال بارگذاری...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">هنوز هیچ پرداختی ثبت نشده است</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-dark-card p-4 rounded-xl border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{formatDate(payment.payment_date)}</span>
                  <span className="text-lg font-bold text-success-400">
                    {formatCurrency(payment.amount)} ریال
                  </span>
                </div>
                {payment.note && (
                  <p className="text-sm text-gray-300">{payment.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default InstallmentCard;
