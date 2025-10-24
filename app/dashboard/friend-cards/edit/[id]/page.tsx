'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import Snackbar from '@/components/ui/Snackbar';
import LoadingState from '@/components/banking/LoadingState';

interface FriendCardData {
  id: number;
  card_title: string;
  card_number: string;
  sheba_number: string;
  description?: string;
}

export default function EditFriendCardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardTitle: '',
    cardNumber: '',
    shebaNumber: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchFriendCard();
  }, [id]);

  const fetchFriendCard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/friend-cards');
      const data = await response.json();

      const friendCard = data.friendCards?.find((card: FriendCardData) => card.id === parseInt(id));

      if (!friendCard) {
        setSnackbar({
          open: true,
          message: 'کارت دوست یافت نشد',
          severity: 'error',
        });
        setTimeout(() => router.push('/dashboard/friend-cards'), 2000);
        return;
      }

      setFormData({
        cardTitle: friendCard.card_title,
        cardNumber: friendCard.card_number,
        shebaNumber: friendCard.sheba_number.replace(/^IR/i, ''),
        description: friendCard.description || '',
      });
    } catch (error) {
      console.error('Error fetching friend card:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دریافت اطلاعات کارت',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardTitle.trim()) {
      newErrors.cardTitle = 'عنوان کارت الزامی است';
    }

    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'شماره کارت باید 16 رقم باشد';
    }

    const cleanSheba = formData.shebaNumber.replace(/IR/i, '').replace(/\s/g, '');
    if (!cleanSheba || !/^\d{24}$/.test(cleanSheba)) {
      newErrors.shebaNumber = 'شماره شبا باید 24 رقم باشد';
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
      const response = await fetch(`/api/friend-cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardTitle: formData.cardTitle,
          cardNumber: formData.cardNumber,
          shebaNumber: formData.shebaNumber.replace(/IR/i, ''),
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در بروزرسانی کارت');
      }

      setSnackbar({
        open: true,
        message: 'کارت دوست با موفقیت بروزرسانی شد',
        severity: 'success',
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/friend-cards');
      }, 1000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setFormData({ ...formData, cardNumber: value });
  };

  const handleShebaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/IR/i, '').replace(/\D/g, '').slice(0, 24);
    setFormData({ ...formData, shebaNumber: value });
  };

  const formatCardNumber = (number: string) => {
    if (!number) return '';
    return number.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const formatShebaNumber = (number: string) => {
    if (!number) return '';
    const clean = number.replace(/IR/i, '');
    return `IR${clean.replace(/(\d{4})(?=\d)/g, '$1-')}`;
  };

  if (loading) {
    return <LoadingState variant="page" />;
  }

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
          <h1 className="text-3xl font-bold text-white">ویرایش کارت دوست</h1>
          <p className="text-gray-400 mt-1">بروزرسانی اطلاعات کارت بانکی</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Title */}
          <TextField
            label="عنوان کارت"
            placeholder="مثال: علی محمدی، حساب شخصی احمد و..."
            value={formData.cardTitle}
            onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
            fullWidth
            required
            error={!!errors.cardTitle}
            errorText={errors.cardTitle}
            helperText="یک نام یا عنوان برای شناسایی راحت‌تر این کارت وارد کنید"
          />

          {/* Card Number */}
          <div>
            <TextField
              label="شماره کارت"
              placeholder="1234567890123456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              type="text"
              fullWidth
              required
              error={!!errors.cardNumber}
              errorText={errors.cardNumber}
              helperText={
                formData.cardNumber
                  ? formatCardNumber(formData.cardNumber)
                  : 'شماره کارت 16 رقمی را وارد کنید'
              }
            />
          </div>

          {/* Sheba Number */}
          <div>
            <TextField
              label="شماره شبا"
              placeholder="012345678901234567890123"
              value={formData.shebaNumber}
              onChange={handleShebaChange}
              type="text"
              fullWidth
              required
              error={!!errors.shebaNumber}
              errorText={errors.shebaNumber}
              helperText={
                formData.shebaNumber
                  ? formatShebaNumber(formData.shebaNumber)
                  : 'شماره شبا 24 رقمی را بدون IR وارد کنید'
              }
            />
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
              placeholder="توضیحات تکمیلی درباره این کارت..."
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
              بروزرسانی کارت
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
              با ویرایش این کارت، تمام اطلاعات قبلی آن بروزرسانی خواهد شد.
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
