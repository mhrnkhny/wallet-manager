'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, TextField, Modal } from '@/components/ui';
import { Container } from '@/components/layout';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Stats {
  totalCards: number;
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [cardsRes, transactionsRes] = await Promise.all([
        fetch('/api/cards'),
        fetch('/api/transactions'),
      ]);

      if (cardsRes.ok && transactionsRes.ok) {
        const cardsData = await cardsRes.json();
        const transactionsData = await transactionsRes.json();

        const cards = cardsData.cards || [];
        const transactions = transactionsData.transactions || [];

        const deposits = transactions.filter((t: any) => t.transaction_type === 'deposit');
        const withdrawals = transactions.filter((t: any) => t.transaction_type === 'withdrawal');

        setStats({
          totalCards: cards.length,
          totalTransactions: transactions.length,
          totalDeposits: deposits.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0),
          totalWithdrawals: withdrawals.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0),
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('نام نمی‌تواند خالی باشد');
      return;
    }

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user!, name });
        setSuccess('پروفایل با موفقیت به‌روزرسانی شد');
        setIsEditModalOpen(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'خطا در به‌روزرسانی پروفایل');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('تمام فیلدها الزامی است');
      return;
    }

    if (newPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل 6 کاراکتر باشد');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('رمز عبور با موفقیت تغییر کرد');
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'خطا در تغییر رمز عبور');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">پروفایل کاربری</h1>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-success-50 border border-success-500 rounded-lg text-success-700">
            {success}
          </div>
        )}

        {/* User Info Card */}
        <Card variant="elevated" padding="large">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                عضو از: {formatDate(user.created_at)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="filled"
                color="primary"
                onClick={() => setIsEditModalOpen(true)}
              >
                ویرایش پروفایل
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                تغییر رمز عبور
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Cards */}
            <Card variant="elevated" padding="medium">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
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
                  <p className="text-sm text-gray-600">تعداد کارت‌ها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
                </div>
              </div>
            </Card>

            {/* Total Transactions */}
            <Card variant="elevated" padding="medium">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-600"
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
                  <p className="text-sm text-gray-600">تعداد تراکنش‌ها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                </div>
              </div>
            </Card>

            {/* Total Deposits */}
            <Card variant="elevated" padding="medium">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-success-600"
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
                  <p className="text-sm text-gray-600">مجموع واریزی‌ها</p>
                  <p className="text-lg font-bold text-success-600">
                    {formatCurrency(stats.totalDeposits)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Total Withdrawals */}
            <Card variant="elevated" padding="medium">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-error-600"
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
                  <p className="text-sm text-gray-600">مجموع برداشت‌ها</p>
                  <p className="text-lg font-bold text-error-600">
                    {formatCurrency(stats.totalWithdrawals)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Account Actions */}
        <Card variant="outlined" padding="large">
          <h3 className="text-lg font-bold text-gray-900 mb-4">تنظیمات حساب</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">اطلاعات کاربری</p>
                  <p className="text-sm text-gray-600">ویرایش نام و مشخصات</p>
                </div>
              </div>
              <Button
                variant="text"
                color="primary"
                onClick={() => setIsEditModalOpen(true)}
              >
                ویرایش
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">امنیت</p>
                  <p className="text-sm text-gray-600">تغییر رمز عبور</p>
                </div>
              </div>
              <Button
                variant="text"
                color="primary"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                تغییر رمز
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setError('');
          setName(user.name);
        }}
        title="ویرایش پروفایل"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              {error}
            </div>
          )}

          <TextField
            label="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder="نام خود را وارد کنید"
          />

          <TextField
            label="ایمیل"
            value={user.email}
            disabled
            fullWidth
            helperText="ایمیل قابل تغییر نیست"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditModalOpen(false);
                setError('');
                setName(user.name);
              }}
            >
              انصراف
            </Button>
            <Button variant="filled" color="primary" onClick={handleUpdateProfile}>
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setError('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="تغییر رمز عبور"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              {error}
            </div>
          )}

          <TextField
            label="رمز عبور فعلی"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="رمز عبور جدید"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            helperText="حداقل 6 کاراکتر"
          />

          <TextField
            label="تکرار رمز عبور جدید"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outlined"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setError('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              انصراف
            </Button>
            <Button variant="filled" color="primary" onClick={handleChangePassword}>
              تغییر رمز عبور
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
