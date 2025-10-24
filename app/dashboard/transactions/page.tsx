'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TransactionCard from '@/components/banking/TransactionCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import TextField from '@/components/ui/TextField';
import FAB from '@/components/layout/FAB';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import Snackbar from '@/components/ui/Snackbar';

interface Transaction {
  id: number;
  transaction_type: 'deposit' | 'withdrawal';
  amount: number;
  title: string;
  description: string;
  jalali_date: string;
  card_number: string;
  bank_name: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Filter and sort states
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, filterType, sortBy, searchQuery]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setSnackbar({ open: true, message: 'خطا در دریافت تراکنش‌ها', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...transactions];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.transaction_type === filterType);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.bank_name.toLowerCase().includes(query)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.jalali_date).getTime() - new Date(a.jalali_date).getTime();
        case 'date-asc':
          return new Date(a.jalali_date).getTime() - new Date(b.jalali_date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    try {
      const response = await fetch(`/api/transactions/${transactionToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'تراکنش با موفقیت حذف شد', severity: 'success' });
        fetchTransactions();
      } else {
        throw new Error('خطا در حذف تراکنش');
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  // Calculate statistics
  const stats = {
    total: transactions.length,
    deposits: transactions.filter((t) => t.transaction_type === 'deposit').length,
    withdrawals: transactions.filter((t) => t.transaction_type === 'withdrawal').length,
  };

  if (loading) {
    return <LoadingState variant="list" count={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تراکنش‌ها</h1>
          <p className="text-gray-600 mt-1">
            مجموع {stats.total} تراکنش ({stats.deposits} واریز، {stats.withdrawals} برداشت)
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="هیچ تراکنشی ثبت نشده"
          description="شما هنوز هیچ تراکنشی ثبت نکرده‌اید. برای شروع، اولین تراکنش خود را اضافه کنید."
          actionLabel="افزودن تراکنش"
          onAction={() => router.push('/dashboard/transactions/new')}
        />
      ) : (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <TextField
                placeholder="جستجو در تراکنش‌ها..."
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
              />

              {/* Type Filter */}
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: 'all', label: 'همه تراکنش‌ها' },
                  { value: 'deposit', label: 'فقط واریزها' },
                  { value: 'withdrawal', label: 'فقط برداشت‌ها' },
                ]}
                fullWidth
              />

              {/* Sort */}
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'date-desc', label: 'جدیدترین' },
                  { value: 'date-asc', label: 'قدیمی‌ترین' },
                  { value: 'amount-desc', label: 'بیشترین مبلغ' },
                  { value: 'amount-asc', label: 'کمترین مبلغ' },
                ]}
                fullWidth
              />
            </div>

            {/* Active filters info */}
            {(filterType !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>نمایش {filteredTransactions.length} از {transactions.length} تراکنش</span>
                {(filterType !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setSearchQuery('');
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    پاک کردن فیلترها
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-gray-600">
                برای جستجوی خود تراکنشی پیدا نشد. فیلترهای دیگری را امتحان کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  id={transaction.id}
                  title={transaction.title}
                  description={transaction.description}
                  amount={transaction.amount}
                  type={transaction.transaction_type}
                  date={transaction.jalali_date}
                  bankName={transaction.bank_name}
                  cardNumber={transaction.card_number}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="حذف تراکنش"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            آیا از حذف این تراکنش اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
          </p>

          <div className="flex gap-3">
            <Button
              variant="filled"
              color="error"
              fullWidth
              onClick={handleDeleteConfirm}
            >
              حذف تراکنش
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

      {/* FAB for adding transaction */}
      <FAB
        extended
        label="افزودن تراکنش"
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
        onClick={() => router.push('/dashboard/transactions/new')}
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
