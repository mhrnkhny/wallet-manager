'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment-jalaali';
import TransactionCard from '@/components/banking/TransactionCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import TextField from '@/components/ui/TextField';
import DatePicker from '@/components/ui/DatePicker';
import FAB from '@/components/layout/FAB';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import Snackbar from '@/components/ui/Snackbar';
import { prefersReducedMotion } from '@/components/animations/AnimationConfig';

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
  const shouldReduceMotion = prefersReducedMotion();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Filter accordion state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort states
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, filterType, sortBy, searchQuery, fromDate, toDate]);

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

    // Apply date range filter
    if (fromDate) {
      filtered = filtered.filter((t) => {
        // Convert jalali date to gregorian for comparison
        const transactionGregorian = moment(t.jalali_date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        return transactionGregorian >= fromDate;
      });
    }
    if (toDate) {
      filtered = filtered.filter((t) => {
        // Convert jalali date to gregorian for comparison
        const transactionGregorian = moment(t.jalali_date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        return transactionGregorian <= toDate;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          // Convert jalali to gregorian for proper date comparison
          const dateA = moment(a.jalali_date, 'jYYYY/jMM/jDD').toDate().getTime();
          const dateB = moment(b.jalali_date, 'jYYYY/jMM/jDD').toDate().getTime();
          return dateB - dateA;
        case 'date-asc':
          // Convert jalali to gregorian for proper date comparison
          const dateA2 = moment(a.jalali_date, 'jYYYY/jMM/jDD').toDate().getTime();
          const dateB2 = moment(b.jalali_date, 'jYYYY/jMM/jDD').toDate().getTime();
          return dateA2 - dateB2;
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

  // Check if any filter is active
  const hasActiveFilters = filterType !== 'all' || searchQuery || fromDate || toDate;

  // Calculate filtered statistics
  const filteredStats = {
    totalDeposits: filteredTransactions
      .filter((t) => t.transaction_type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: filteredTransactions
      .filter((t) => t.transaction_type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    // Handle NaN, undefined, null cases
    if (amount == null || isNaN(amount)) {
      return '0';
    }
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  if (loading) {
    return <LoadingState variant="list" count={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">تراکنش‌ها</h1>
          <p className="text-gray-400 mt-1">
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
          {/* Filters Accordion */}
          <div className="bg-dark-surface rounded-3xl shadow-xl border border-gray-700/30 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-white font-medium">فیلترها و جستجو</span>
                {(filterType !== 'all' || searchQuery || fromDate || toDate) && (
                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                    فعال
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Accordion Content */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-700/30 pt-4">
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

                    {/* Date Range Filters with DatePicker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DatePicker
                        label="از تاریخ"
                        value={fromDate}
                        onChange={setFromDate}
                        placeholder="انتخاب تاریخ شروع"
                        fullWidth
                      />
                      <DatePicker
                        label="تا تاریخ"
                        value={toDate}
                        onChange={setToDate}
                        placeholder="انتخاب تاریخ پایان"
                        fullWidth
                      />
                    </div>

                    {/* Active filters info and statistics */}
                    {hasActiveFilters && (
                      <div className="space-y-3 pt-2 border-t border-gray-700/30">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Count */}
                          <div className="bg-dark-card rounded-xl p-3 border border-gray-700/30">
                            <p className="text-xs text-gray-400 mb-1">تعداد تراکنش‌ها</p>
                            <p className="text-xl font-bold text-white">
                              {filteredTransactions.length}
                              <span className="text-sm text-gray-400 font-normal mr-1">
                                از {transactions.length}
                              </span>
                            </p>
                          </div>

                          {/* Total Deposits */}
                          <div className="bg-success-500/10 rounded-xl p-3 border border-success-500/30">
                            <p className="text-xs text-success-400 mb-1">مجموع واریز</p>
                            <p className="text-xl font-bold text-success-400 direction-ltr text-right">
                              {formatCurrency(filteredStats.totalDeposits)}
                              <span className="text-sm font-normal mr-1">ریال</span>
                            </p>
                          </div>

                          {/* Total Withdrawals */}
                          <div className="bg-error-500/10 rounded-xl p-3 border border-error-500/30">
                            <p className="text-xs text-error-400 mb-1">مجموع برداشت</p>
                            <p className="text-xl font-bold text-error-400 direction-ltr text-right">
                              {formatCurrency(filteredStats.totalWithdrawals)}
                              <span className="text-sm font-normal mr-1">ریال</span>
                            </p>
                          </div>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              setFilterType('all');
                              setSearchQuery('');
                              setFromDate('');
                              setToDate('');
                            }}
                            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors text-sm"
                          >
                            پاک کردن فیلترها
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="bg-dark-surface rounded-3xl shadow-xl p-12 text-center border border-gray-700/30">
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
              <p className="text-gray-400">
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
          <p className="text-gray-300">
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
