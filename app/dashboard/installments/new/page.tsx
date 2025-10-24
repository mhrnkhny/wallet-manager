'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import Snackbar from '@/components/ui/Snackbar';
import DatePicker from '@/components/ui/DatePicker';

export default function NewInstallmentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    installmentTitle: '',
    startDate: '',
    endDate: '',
    paymentDayOfMonth: '',
    totalAmount: '',
    installmentAmount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.installmentTitle.trim()) {
      newErrors.installmentTitle = 'عنوان قسط الزامی است';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'تاریخ شروع الزامی است';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'تاریخ پایان الزامی است';
    }

    const paymentDay = parseInt(formData.paymentDayOfMonth);
    if (!formData.paymentDayOfMonth || isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31) {
      newErrors.paymentDayOfMonth = 'روز پرداخت باید بین 1 تا 31 باشد';
    }

    const totalAmount = parseFloat(formData.totalAmount);
    if (!formData.totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      newErrors.totalAmount = 'مجموع کل باید بیشتر از صفر باشد';
    }

    const installmentAmount = parseFloat(formData.installmentAmount);
    if (!formData.installmentAmount || isNaN(installmentAmount) || installmentAmount <= 0) {
      newErrors.installmentAmount = 'مبلغ هر قسط باید بیشتر از صفر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/installments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          installmentTitle: formData.installmentTitle,
          startDate: formData.startDate,
          endDate: formData.endDate,
          paymentDayOfMonth: parseInt(formData.paymentDayOfMonth),
          totalAmount: parseFloat(formData.totalAmount),
          installmentAmount: parseFloat(formData.installmentAmount),
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ایجاد قسط');
      }

      setSnackbar({
        open: true,
        message: 'قسط با موفقیت ایجاد شد',
        severity: 'success',
      });

      setTimeout(() => {
        router.push('/dashboard/installments');
      }, 1000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('fa-IR').format(parseInt(number));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold text-white">افزودن قسط جدید</h1>
          <p className="text-gray-400 mt-1">ثبت اطلاعات قسط جدید</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Installment Title */}
          <TextField
            label="عنوان قسط"
            placeholder="مثال: قسط خودرو، قسط خانه، ..."
            value={formData.installmentTitle}
            onChange={(e) => setFormData({ ...formData, installmentTitle: e.target.value })}
            fullWidth
            required
            error={!!errors.installmentTitle}
            errorText={errors.installmentTitle}
            helperText="یک عنوان برای شناسایی راحت‌تر این قسط وارد کنید"
          />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="تاریخ شروع قسط"
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              placeholder="انتخاب تاریخ شروع"
              fullWidth
              error={errors.startDate}
            />
            <DatePicker
              label="تاریخ پایان قسط"
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              placeholder="انتخاب تاریخ پایان"
              fullWidth
              error={errors.endDate}
            />
          </div>

          {/* Payment Day */}
          <TextField
            label="روز پرداخت در هر ماه"
            placeholder="مثال: 15"
            value={formData.paymentDayOfMonth}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                setFormData({ ...formData, paymentDayOfMonth: value });
              }
            }}
            type="text"
            fullWidth
            required
            error={!!errors.paymentDayOfMonth}
            errorText={errors.paymentDayOfMonth}
            helperText="روز ماه که باید قسط پرداخت شود (1 تا 31)"
          />

          {/* Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextField
                label="مجموع کل (ریال)"
                placeholder="0"
                value={formData.totalAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, totalAmount: value });
                }}
                type="text"
                fullWidth
                required
                error={!!errors.totalAmount}
                errorText={errors.totalAmount}
                helperText={
                  formData.totalAmount
                    ? formatCurrency(formData.totalAmount) + ' ریال'
                    : 'کل مبلغ قسط'
                }
              />
            </div>
            <div>
              <TextField
                label="مبلغ هر قسط (ریال)"
                placeholder="0"
                value={formData.installmentAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, installmentAmount: value });
                }}
                type="text"
                fullWidth
                required
                error={!!errors.installmentAmount}
                errorText={errors.installmentAmount}
                helperText={
                  formData.installmentAmount
                    ? formatCurrency(formData.installmentAmount) + ' ریال'
                    : 'مبلغ پرداختی هر ماه'
                }
              />
            </div>
          </div>

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
              placeholder="توضیحات تکمیلی درباره این قسط..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="filled"
              color="primary"
              fullWidth
              loading={submitting}
            >
              ایجاد قسط
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

      {/* Info Card */}
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
              نکته
            </h4>
            <p className="text-xs text-gray-300">
              با ثبت اطلاعات قسط، می‌توانید پرداخت‌های ماهانه خود را به راحتی پیگیری کنید.
            </p>
          </div>
        </div>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
