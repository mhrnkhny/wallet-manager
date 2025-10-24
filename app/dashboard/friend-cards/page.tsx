'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import FriendCard from '@/components/banking/FriendCard';
import EmptyState from '@/components/banking/EmptyState';
import LoadingState from '@/components/banking/LoadingState';
import Snackbar from '@/components/ui/Snackbar';
import FAB from '@/components/layout/FAB';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

interface FriendCardData {
  id: number;
  card_title: string;
  card_number: string;
  sheba_number: string;
  description?: string;
}

export default function FriendCardsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [friendCards, setFriendCards] = useState<FriendCardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<FriendCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{ id: number; title: string } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchFriendCards();
  }, []);

  useEffect(() => {
    applySearch();
  }, [friendCards, searchQuery]);

  const applySearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCards(friendCards);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = friendCards.filter((card) =>
      card.card_title.toLowerCase().includes(query) ||
      card.card_number.includes(query) ||
      card.sheba_number.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query)
    );

    setFilteredCards(filtered);
  };

  const fetchFriendCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/friend-cards');
      const data = await response.json();
      setFriendCards(data.friendCards || []);
    } catch (error) {
      console.error('Error fetching friend cards:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دریافت کارت‌های دوستان',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    // Find the card to get its title for the confirmation message
    const card = friendCards.find((c) => c.id === id);
    const cardTitle = card?.card_title || 'این کارت';

    setCardToDelete({ id, title: cardTitle });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;

    try {
      const response = await fetch(`/api/friend-cards/${cardToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در حذف کارت');
      }

      setSnackbar({
        open: true,
        message: `کارت "${cardToDelete.title}" با موفقیت حذف شد`,
        severity: 'success',
      });

      // Remove from local state
      setFriendCards(friendCards.filter((card) => card.id !== cardToDelete.id));
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/friend-cards/edit/${id}`);
  };

  if (loading) {
    return <LoadingState variant="page" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">کارت‌های دوستان</h1>
          <p className="text-gray-400 mt-1">
            مدیریت اطلاعات کارت بانکی دوستان برای انتقال راحت‌تر وجه
          </p>
        </div>
      </div>

      {/* Search Bar */}
      {friendCards.length > 0 && (
        <Card className="p-4">
          <TextField
            placeholder="جستجو در کارت‌های دوستان (نام، شماره کارت، شبا، توضیحات)..."
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

      {/* Friend Cards Grid */}
      {friendCards.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            title="هیچ کارتی ثبت نشده"
            description="شما هنوز هیچ کارت دوستی اضافه نکرده‌اید. برای شروع، اولین کارت را اضافه کنید."
            actionLabel="افزودن کارت دوست"
            onAction={() => router.push('/dashboard/friend-cards/new')}
          />
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">تعداد دوستان</p>
                  <p className="text-xl font-bold text-white">
                    {filteredCards.length}
                    {searchQuery && (
                      <span className="text-sm text-gray-400 font-normal mr-1">
                        از {friendCards.length}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cards Grid or No Results */}
          {filteredCards.length === 0 ? (
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
                کارتی با عبارت جستجوی "{searchQuery}" پیدا نشد.
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
              {filteredCards.map((card) => (
                <FriendCard
                  key={card.id}
                  id={card.id}
                  cardTitle={card.card_title}
                  cardNumber={card.card_number}
                  shebaNumber={card.sheba_number}
                  description={card.description}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* FAB for adding new friend card */}
      <FAB
        extended
        label="افزودن کارت دوست"
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
        onClick={() => router.push('/dashboard/friend-cards/new')}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="حذف کارت دوست"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            آیا از حذف کارت <span className="font-semibold text-white">"{cardToDelete?.title}"</span> اطمینان دارید؟
          </p>
          <p className="text-sm text-gray-400">
            این عملیات غیرقابل بازگشت است و تمام اطلاعات این کارت حذف خواهد شد.
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
