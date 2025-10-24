'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment-jalaali';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import BankCard from '@/components/banking/BankCard';
import Snackbar from '@/components/ui/Snackbar';
import DatePicker from '@/components/ui/DatePicker';

interface CardData {
  id: number;
  card_number: string;
  bank_name: string;
  card_holder_name: string;
}

const CARD_GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-green-600 to-green-800',
  'from-red-600 to-red-800',
  'from-orange-600 to-orange-800',
  'from-pink-600 to-pink-800',
];

export default function NewTransactionPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardId: '',
    transactionType: 'deposit' as 'deposit' | 'withdrawal',
    amount: '',
    title: '',
    description: '',
    jalaliDate: moment().format('jYYYY/jMM/jDD'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards');
      const data = await response.json();
      setCards(data.cards || []);
      if (data.cards && data.cards.length > 0) {
        setFormData((prev) => ({ ...prev, cardId: data.cards[0].id.toString() }));
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setSnackbar({ open: true, message: 'خطا در دریافت کارت‌ها', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardId) {
      newErrors.cardId = 'لطفا یک کارت انتخاب کنید';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'مبلغ باید بیشتر از صفر باشد';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الزامی است';
    }

    if (!formData.jalaliDate) {
      newErrors.jalaliDate = 'تاریخ الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cards.length === 0) {
      setSnackbar({
        open: true,
        message: 'ابتدا باید حداقل یک کارت بانکی اضافه کنید',
        severity: 'error',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          cardId: parseInt(formData.cardId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در افزودن تراکنش');
      }

      setSnackbar({
        open: true,
        message: 'تراکنش با موفقیت ثبت شد',
        severity: 'success',
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/transactions');
      }, 1000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, amount: value });
  };

  const formatAmount = (amount: string) => {
    if (!amount) return '';
    return new Intl.NumberFormat('fa-IR').format(parseInt(amount));
  };

  const selectedCard = cards.find((c) => c.id.toString() === formData.cardId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-900/20 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-warning-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">نیاز به کارت بانکی</h2>
          <p className="text-gray-400 mb-6">
            برای ثبت تراکنش، ابتدا باید حداقل یک کارت بانکی اضافه کنید
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="filled"
              color="primary"
              onClick={() => router.push('/dashboard/cards')}
            >
              رفتن به صفحه کارت‌ها
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/dashboard')}
            >
              بازگشت به داشبورد
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-dark-bg rounded-2xl transition-colors text-gray-400 hover:text-white"
          aria-label="بازگشت"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">افزودن تراکنش جدید</h1>
          <p className="text-gray-400 mt-1">ثبت واریز یا برداشت وجه</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  نوع تراکنش
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transactionType: 'deposit' })
                    }
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      formData.transactionType === 'deposit'
                        ? 'border-success-500 bg-success-600/20'
                        : 'border-gray-600/30 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.transactionType === 'deposit'
                            ? 'bg-success-500 text-white'
                            : 'bg-dark-bg text-gray-400'
                        }`}
                      >
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">واریز</p>
                        <p className="text-xs text-gray-400">دریافت وجه</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transactionType: 'withdrawal' })
                    }
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      formData.transactionType === 'withdrawal'
                        ? 'border-error-500 bg-error-600/20'
                        : 'border-gray-600/30 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.transactionType === 'withdrawal'
                            ? 'bg-error-500 text-white'
                            : 'bg-dark-bg text-gray-400'
                        }`}
                      >
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
                            d="M20 12H4"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">برداشت</p>
                        <p className="text-xs text-gray-400">پرداخت وجه</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Card Selection */}
              <Select
                label="کارت بانکی"
                value={formData.cardId}
                onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
                options={cards.map((card) => ({
                  value: card.id.toString(),
                  label: `${card.bank_name} - ${card.card_number.slice(-4)}`,
                }))}
                fullWidth
                error={!!errors.cardId}
                errorText={errors.cardId}
                required
              />

              {/* Amount */}
              <div>
                <TextField
                  label="مبلغ (ریال)"
                  placeholder="1000000"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  type="text"
                  fullWidth
                  required
                  error={!!errors.amount}
                  errorText={errors.amount}
                  helperText={
                    formData.amount
                      ? `${formatAmount(formData.amount)} ریال`
                      : 'مبلغ تراکنش را وارد کنید'
                  }
                />
              </div>

              {/* Title */}
              <TextField
                label="عنوان تراکنش"
                placeholder="خرید آنلاین، دریافت حقوق و..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
                error={!!errors.title}
                errorText={errors.title}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 text-base rounded-2xl border-2 border-gray-600/30 bg-dark-surface text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="توضیحات تکمیلی درباره تراکنش..."
                />
              </div>

              {/* Date */}
              <DatePicker
                label="تاریخ تراکنش"
                value={formData.jalaliDate}
                onChange={(date) => setFormData({ ...formData, jalaliDate: date })}
                placeholder="انتخاب تاریخ"
                fullWidth
                error={errors.jalaliDate}
              />

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="filled"
                  color="primary"
                  fullWidth
                  loading={submitting}
                >
                  ثبت تراکنش
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="space-y-4 sticky top-20">
            <Card className="p-4">
              <h3 className="font-semibold text-white mb-3">پیش‌نمایش</h3>

              {/* Selected Card Preview */}
              {selectedCard && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">کارت انتخاب شده</p>
                  <BankCard
                    cardNumber={selectedCard.card_number}
                    bankName={selectedCard.bank_name}
                    cardHolderName={selectedCard.card_holder_name}
                    variant="compact"
                  />
                </div>
              )}

              {/* Transaction Summary */}
              <div className="space-y-3 pt-3 border-t border-gray-700/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">نوع</span>
                  <span
                    className={`text-sm font-medium ${
                      formData.transactionType === 'deposit'
                        ? 'text-success-400'
                        : 'text-error-400'
                    }`}
                  >
                    {formData.transactionType === 'deposit' ? 'واریز' : 'برداشت'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">مبلغ</span>
                  <span className="text-sm font-bold text-white">
                    {formData.amount
                      ? `${formatAmount(formData.amount)} ریال`
                      : '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">تاریخ</span>
                  <span className="text-sm text-white">
                    {formData.jalaliDate || '-'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Help Card */}
            <Card className="p-4 bg-primary-600/10 border-2 border-primary-500/30">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-primary-300 mb-1">
                    راهنما
                  </h4>
                  <p className="text-xs text-gray-300">
                    تراکنش‌های واریز موجودی شما را افزایش و تراکنش‌های برداشت
                    موجودی را کاهش می‌دهند.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
