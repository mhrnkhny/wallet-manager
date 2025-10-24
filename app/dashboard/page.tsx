'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment-jalaali';
import BalanceDisplay from '@/components/banking/BalanceDisplay';
import TransactionCard from '@/components/banking/TransactionCard';
import Card from '@/components/ui/Card';
import FAB from '@/components/layout/FAB';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import TrendChart from '@/components/charts/TrendChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';

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

interface CardData {
  id: number;
  card_number: string;
  bank_name: string;
  card_holder_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, cardsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/cards'),
      ]);

      const transactionsData = await transactionsRes.json();
      const cardsData = await cardsRes.json();

      setTransactions(transactionsData.transactions || []);
      setCards(cardsData.cards || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalDeposits = transactions
      .filter((t) => t.transaction_type === 'deposit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.transaction_type === 'withdrawal')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalDeposits - totalWithdrawals;

    return {
      balance,
      income: totalDeposits,
      expenses: totalWithdrawals,
      cardsCount: cards.length,
      transactionsCount: transactions.length,
    };
  };

  const stats = calculateStats();
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return <LoadingState variant="page" />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Balance */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">خوش آمدید!</h1>
            <p className="text-gray-400 mt-1">
              امروز {moment().format('jYYYY/jMM/jDD')} - {moment().format('dddd')}
            </p>
          </div>
        </div>

        {/* Balance Display */}
        <BalanceDisplay
          balance={stats.balance}
          income={stats.income}
          expenses={stats.expenses}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-primary-400"
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
            </div>
            <div>
              <p className="text-sm text-gray-400">تعداد کارت‌ها</p>
              <p className="text-2xl font-bold text-white">{stats.cardsCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-secondary-400"
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
            </div>
            <div>
              <p className="text-sm text-gray-400">تعداد تراکنش‌ها</p>
              <p className="text-2xl font-bold text-white">{stats.transactionsCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-success-500"
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
            <div>
              <p className="text-sm text-gray-400">کل واریزی‌ها</p>
              <p className="text-lg font-bold text-success-500">
                {new Intl.NumberFormat('fa-IR').format(stats.income)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-error-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-error-500"
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
            <div>
              <p className="text-sm text-gray-400">کل برداشت‌ها</p>
              <p className="text-lg font-bold text-error-500">
                {new Intl.NumberFormat('fa-IR').format(stats.expenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">نمودارهای تحلیلی</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trend Chart */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">روند واریز و برداشت</h3>
                <p className="text-sm text-gray-400">۷ روز گذشته</p>
              </div>
              <TrendChart transactions={transactions} />
            </Card>

            {/* Bar Chart */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">مقایسه واریز و برداشت</h3>
                <p className="text-sm text-gray-400">۷ روز گذشته</p>
              </div>
              <BarChart transactions={transactions} />
            </Card>

            {/* Pie Chart */}
            <Card className="p-6 lg:col-span-2">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-white">نسبت واریز به برداشت</h3>
                <p className="text-sm text-gray-400">کل دوره</p>
              </div>
              <div className="flex justify-center">
                <PieChart transactions={transactions} />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">آخرین تراکنش‌ها</h2>
          {transactions.length > 0 && (
            <button
              onClick={() => router.push('/dashboard/transactions')}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              مشاهده همه
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              title="هیچ تراکنشی ثبت نشده"
              description="شما هنوز هیچ تراکنشی ثبت نکرده‌اید. برای شروع، اولین تراکنش خود را اضافه کنید."
              actionLabel="افزودن تراکنش"
              onAction={() => router.push('/dashboard/transactions/new')}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/cards')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h3 className="font-semibold text-white">مدیریت کارت‌ها</h3>
              <p className="text-sm text-gray-400">مشاهده و مدیریت کارت‌های بانکی</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/transactions')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-success-500/20">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h3 className="font-semibold text-white">همه تراکنش‌ها</h3>
              <p className="text-sm text-gray-400">مشاهده لیست کامل تراکنش‌ها</p>
            </div>
          </div>
        </Card>
      </div>

      {/* FAB for new transaction */}
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
    </div>
  );
}
