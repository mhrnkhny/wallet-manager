'use client';

import { useState, useEffect } from 'react';
import BankCard from '@/components/banking/BankCard';
import Modal from '@/components/ui/Modal';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import FAB from '@/components/layout/FAB';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import Snackbar from '@/components/ui/Snackbar';

interface Card {
  id: number;
  card_number: string;
  bank_name: string;
  card_holder_name: string;
  card_title?: string;
  cvv2?: string;
  sheba_number?: string;
  balance: number;
  expiry_date?: string;
  created_at: string;
}

const CARD_GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-green-600 to-green-800',
  'from-red-600 to-red-800',
  'from-orange-600 to-orange-800',
  'from-pink-600 to-pink-800',
  'from-indigo-600 to-indigo-800',
  'from-teal-600 to-teal-800',
];

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    bankName: '',
    cardHolderName: '',
    cardTitle: '',
    cvv2: '',
    shebaNumber: '',
    expiryDate: '',
    initialBalance: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards');
      const data = await response.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setSnackbar({ open: true, message: 'خطا در دریافت کارت‌ها', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.cardNumber || !formData.bankName || !formData.cardHolderName) {
      setError('لطفا فیلدهای ضروری را پر کنید');
      return;
    }

    if (!/^\d{16}$/.test(formData.cardNumber)) {
      setError('شماره کارت باید 16 رقم باشد');
      return;
    }

    if (formData.cvv2 && !/^\d{3,4}$/.test(formData.cvv2)) {
      setError('CVV2 باید 3 یا 4 رقم باشد');
      return;
    }

    if (formData.shebaNumber && !/^\d{24}$/.test(formData.shebaNumber)) {
      setError('شماره شبا باید 24 رقم باشد (بدون IR)');
      return;
    }

    if (formData.expiryDate && !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      setError('تاریخ انقضا باید به فرمت MM/YY باشد (مثال: 08/29)');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در افزودن کارت');
      }

      setFormData({ cardNumber: '', bankName: '', cardHolderName: '', cardTitle: '', cvv2: '', shebaNumber: '', expiryDate: '', initialBalance: '' });
      setShowModal(false);
      setSnackbar({ open: true, message: 'کارت با موفقیت اضافه شد', severity: 'success' });
      fetchCards();
    } catch (err: any) {
      setError(err.message);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCardToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;

    try {
      const response = await fetch(`/api/cards/${cardToDelete}`, { method: 'DELETE' });

      if (response.ok) {
        setSnackbar({ open: true, message: 'کارت با موفقیت حذف شد', severity: 'success' });
        fetchCards();
      } else {
        throw new Error('خطا در حذف کارت');
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  if (loading) {
    return <LoadingState variant="card" count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">کارت‌های بانکی</h1>
          <p className="text-gray-400 mt-1">
            مدیریت کارت‌های بانکی خود ({cards.length} کارت)
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-16 h-16"
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
          }
          title="هیچ کارتی ثبت نشده"
          description="شما هنوز هیچ کارت بانکی اضافه نکرده‌اید. برای شروع، اولین کارت خود را اضافه کنید."
          actionLabel="افزودن کارت"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="relative group">
              <BankCard
                cardNumber={card.card_number}
                bankName={card.bank_name}
                cardHolderName={card.card_holder_name}
                cardTitle={card.card_title}
                cvv2={card.cvv2}
                shebaNumber={card.sheba_number}
                balance={card.balance}
                expiryDate={card.expiry_date}
                variant="compact"
                onCopy={(message) => setSnackbar({ open: true, message, severity: 'success' })}
              />

              {/* Delete button overlay */}
              <button
                onClick={() => handleDeleteClick(card.id)}
                className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-surface/90 text-error-500 hover:bg-error-500/20 rounded-full p-2 shadow-lg border border-error-500/30"
                aria-label="حذف کارت"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setError('');
          setFormData({ cardNumber: '', bankName: '', cardHolderName: '', cardTitle: '', cvv2: '', shebaNumber: '', expiryDate: '', initialBalance: '' });
        }}
        title="افزودن کارت جدید"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-500/10 border border-error-500/30 text-error-500 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <TextField
            label="عنوان کارت (اختیاری)"
            placeholder="کارت اصلی، کارت خرید و غیره"
            value={formData.cardTitle}
            onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
            fullWidth
            helperText="یک نام دلخواه برای شناسایی راحت‌تر کارت"
          />

          <TextField
            label="شماره کارت"
            placeholder="1234567812345678"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            type="text"
            maxLength={16}
            required
            fullWidth
            helperText={`${formData.cardNumber.length}/16 رقم`}
          />

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="CVV2 (اختیاری)"
              placeholder="123"
              value={formData.cvv2}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setFormData({ ...formData, cvv2: value });
                }
              }}
              type="text"
              maxLength={4}
              fullWidth
              helperText="3 یا 4 رقم"
            />

            <TextField
              label="تاریخ انقضا (اختیاری)"
              placeholder="08/29"
              value={formData.expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                if (value.length <= 5) {
                  setFormData({ ...formData, expiryDate: value });
                }
              }}
              type="text"
              maxLength={5}
              fullWidth
              helperText="MM/YY"
            />
          </div>

          <TextField
            label="نام بانک"
            placeholder="بانک ملی"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            required
            fullWidth
          />

          <TextField
            label="نام صاحب کارت"
            placeholder="محمد احمدی"
            value={formData.cardHolderName}
            onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
            required
            fullWidth
          />

          <TextField
            label="شماره شبا (اختیاری)"
            placeholder="123456789012345678901234"
            value={formData.shebaNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 24) {
                setFormData({ ...formData, shebaNumber: value });
              }
            }}
            type="text"
            maxLength={24}
            fullWidth
            helperText={`${formData.shebaNumber.length}/24 رقم (بدون IR)`}
          />

          <TextField
            label="موجودی اولیه (اختیاری)"
            placeholder="1000000"
            value={formData.initialBalance}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, initialBalance: value });
            }}
            type="text"
            fullWidth
            helperText="موجودی فعلی کارت به ریال"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="filled"
              color="primary"
              fullWidth
              loading={submitting}
            >
              افزودن کارت
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              انصراف
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="حذف کارت"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            آیا از حذف این کارت اطمینان دارید؟ این عملیات غیرقابل بازگشت است و تمام تراکنش‌های مرتبط با این کارت نیز حذف خواهند شد.
          </p>

          <div className="flex gap-3">
            <Button
              variant="filled"
              color="error"
              fullWidth
              onClick={handleDeleteConfirm}
            >
              حذف کارت
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setDeleteModalOpen(false)}
            >
              انصراف
            </Button>
          </div>
        </div>
      </Modal>

      {/* FAB for adding card */}
      <FAB
        extended
        label="افزودن کارت"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
        onClick={() => setShowModal(true)}
      />

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
