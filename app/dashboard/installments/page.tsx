'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import InstallmentCard from '@/components/banking/InstallmentCard';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import Snackbar from '@/components/ui/Snackbar';
import FAB from '@/components/layout/FAB';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

interface InstallmentData {
  id: number;
  installment_title: string;
  start_date: string;
  end_date: string;
  payment_day_of_month: number;
  total_amount: number;
  installment_amount: number;
  description?: string;
  paid_count?: number;
  total_paid?: number;
}

export default function InstallmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState<InstallmentData[]>([]);
  const [filteredInstallments, setFilteredInstallments] = useState<InstallmentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState<{ id: number; title: string } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchInstallments();
  }, []);

  useEffect(() => {
    applySearch();
  }, [installments, searchQuery]);

  const applySearch = () => {
    if (!searchQuery.trim()) {
      setFilteredInstallments(installments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = installments.filter((installment) =>
      installment.installment_title.toLowerCase().includes(query) ||
      installment.description?.toLowerCase().includes(query)
    );

    setFilteredInstallments(filtered);
  };

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/installments');
      const data = await response.json();
      setInstallments(data.installments || []);
    } catch (error) {
      console.error('Error fetching installments:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دریافت اقساط',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    const installment = installments.find((i) => i.id === id);
    const installmentTitle = installment?.installment_title || 'این قسط';

    setInstallmentToDelete({ id, title: installmentTitle });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!installmentToDelete) return;

    try {
      const response = await fetch(`/api/installments/${installmentToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در حذف قسط');
      }

      setSnackbar({
        open: true,
        message: `قسط "${installmentToDelete.title}" با موفقیت حذف شد`,
        severity: 'success',
      });

      setInstallments(installments.filter((installment) => installment.id !== installmentToDelete.id));
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setDeleteModalOpen(false);
      setInstallmentToDelete(null);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/installments/edit/${id}`);
  };

  if (loading) {
    return <LoadingState variant="page" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">اقساط</h1>
          <p className="text-gray-400 mt-1">
            مدیریت اقساط و پرداخت‌های ماهانه
          </p>
        </div>
      </div>

      {/* Search Bar */}
      {installments.length > 0 && (
        <Card className="p-4">
          <TextField
            placeholder="جستجو در اقساط (عنوان، توضیحات)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            endAdornment={
              searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="پاک کردن جستجو"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )
            }
          />
        </Card>
      )}

      {/* Installments Grid */}
      {installments.length === 0 ? (
        <Card>
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            }
            title="هیچ قسطی ثبت نشده"
            description="شما هنوز هیچ قسطی اضافه نکرده‌اید. برای شروع، اولین قسط را اضافه کنید."
            actionLabel="افزودن قسط"
            onAction={() => router.push('/dashboard/installments/new')}
          />
        </Card>
      ) : (
        <>
          {/* Stats */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">تعداد اقساط</p>
                <p className="text-xl font-bold text-white">
                  {filteredInstallments.length}
                  {searchQuery && (
                    <span className="text-sm text-gray-400 font-normal mr-1">
                      از {installments.length}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Installments Grid or No Results */}
          {filteredInstallments.length === 0 ? (
            <Card className="p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-gray-400 mb-4">
                قسطی با عبارت جستجوی "{searchQuery}" پیدا نشد.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-xl transition-colors text-sm"
              >
                پاک کردن جستجو
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInstallments.map((installment) => (
                <InstallmentCard
                  key={installment.id}
                  id={installment.id}
                  installmentTitle={installment.installment_title}
                  startDate={installment.start_date}
                  endDate={installment.end_date}
                  paymentDayOfMonth={installment.payment_day_of_month}
                  totalAmount={installment.total_amount}
                  installmentAmount={installment.installment_amount}
                  description={installment.description}
                  paidCount={installment.paid_count || 0}
                  totalPaid={installment.total_paid || 0}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onPaymentAdded={fetchInstallments}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* FAB for adding new installment */}
      <FAB
        extended
        label="افزودن قسط"
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
        onClick={() => router.push('/dashboard/installments/new')}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="حذف قسط"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            آیا از حذف قسط <span className="font-semibold text-white">"{installmentToDelete?.title}"</span> اطمینان دارید؟
          </p>
          <p className="text-sm text-gray-400">
            این عملیات غیرقابل بازگشت است و تمام اطلاعات این قسط حذف خواهد شد.
          </p>

          <div className="flex gap-3">
            <Button
              variant="filled"
              color="error"
              fullWidth
              onClick={handleDeleteConfirm}
            >
              حذف قسط
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
