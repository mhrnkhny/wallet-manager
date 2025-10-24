'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField, Card } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'نام الزامی است';
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = 'نام باید حداقل 3 کاراکتر باشد';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'ایمیل الزامی است';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setApiError(data.error || 'خطا در ثبت‌نام');
      }
    } catch (err) {
      setApiError('خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg" dir="rtl">
      <div className="w-full max-w-md">
        <Card padding="large" className="w-full">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue mb-4 shadow-lg shadow-primary-500/30">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ثبت‌نام در سیستم
            </h1>
            <p className="text-gray-400">حساب کاربری خود را ایجاد کنید</p>
          </div>

          {/* Error message */}
          {apiError && (
            <div
              className="mb-6 p-4 bg-error-500/10 border-2 border-error-500/30 rounded-2xl text-error-500 text-sm flex items-start gap-2"
              role="alert"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label="نام کامل"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              error={!!errors.name}
              errorText={errors.name}
              fullWidth
              placeholder="نام و نام خانوادگی"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <TextField
              label="ایمیل"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={!!errors.email}
              errorText={errors.email}
              fullWidth
              placeholder="example@email.com"
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
            />

            <TextField
              label="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={!!errors.password}
              errorText={errors.password}
              fullWidth
              placeholder="حداقل 6 کاراکتر"
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />

            <TextField
              label="تکرار رمز عبور"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: '' });
              }}
              error={!!errors.confirmPassword}
              errorText={errors.confirmPassword}
              fullWidth
              placeholder="رمز عبور را تکرار کنید"
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="filled"
              color="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              ثبت‌نام
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-dark-surface text-gray-400">
                یا
              </span>
            </div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-gray-300">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link
                href="/login"
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                وارد شوید
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © 1404 سیستم مدیریت تراکنش. تمامی حقوق محفوظ است.
        </p>
      </div>
    </div>
  );
}
