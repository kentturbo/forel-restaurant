// pages/admin/reviews.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { StarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const AdminReviewsPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, all
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchReviews(savedToken);
  }, []);

  const fetchReviews = async (authToken) => {
    try {
      const response = await fetch('/api/reviews/all', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId, approve) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: approve })
      });

      if (response.ok) {
        toast.success(approve ? 'Отзыв одобрен' : 'Отзыв отклонен');
        fetchReviews(token);
      }
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Удалить этот отзыв?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Отзыв удален');
        fetchReviews(token);
      }
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const getFilteredReviews = () => {
    switch (filter) {
      case 'pending':
        return reviews.filter(r => r.approved === false || r.approved === undefined);
      case 'approved':
        return reviews.filter(r => r.approved === true);
      default:
        return reviews;
    }
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управление отзывами</h1>
              <p className="text-gray-600 mt-1">
                На модерации: {reviews.filter(r => !r.approved).length}
              </p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="btn-secondary"
            >
              Назад
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'pending'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              На модерации
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'approved'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Одобренные
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Все отзывы
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{review.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date || review.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    <div className="flex items-center space-x-4">
                      {review.approved === true ? (
                        <span className="text-green-600 text-sm font-medium">
                          ✓ Одобрен
                        </span>
                      ) : review.approved === false ? (
                        <span className="text-red-600 text-sm font-medium">
                          ✗ Отклонен
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(review.id, true)}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Одобрить
                          </button>
                          <button
                            onClick={() => handleApprove(review.id, false)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Отклонить
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет отзывов для отображения</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminReviewsPage;