// pages/reviews.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { reviewsAPI } from '../lib/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{review.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </motion.div>
  );
};

const ReviewForm = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = (data) => {
    if (rating === 0) {
      toast.error('Пожалуйста, поставьте оценку');
      return;
    }
    onSubmit({ ...data, rating });
    reset();
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('reviews.form.name')}
        </label>
        <input
          type="text"
          {...register('name', { required: t('validation.required') })}
          className="input"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('reviews.form.rating')}
        </label>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              {i < (hoverRating || rating) ? (
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('reviews.form.comment')}
        </label>
        <textarea
          rows={4}
          {...register('comment', { required: t('validation.required') })}
          className="input"
          placeholder="Поделитесь вашими впечатлениями..."
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full btn-primary"
      >
        {t('reviews.form.submit')}
      </motion.button>
    </form>
  );
};

const ReviewsPage = () => {
  const { t } = useTranslation('common');
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewsAPI.getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // If API fails, show empty state instead of mock data
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewsAPI.createReview(reviewData);
      toast.success(t('reviews.success'));
      setShowForm(false);
      // Refresh reviews list
      fetchReviews();
    } catch (error) {
      toast.error('Произошла ошибка при отправке отзыва');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-100 to-accent-100 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('reviews.title')}
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-semibold">{averageRating}</span>
              <span className="text-gray-600">({reviews.length} отзывов)</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom max-w-4xl">
          {/* Write Review Button */}
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? 'Скрыть форму' : t('reviews.write')}
            </motion.button>
          </div>

          {/* Review Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Оставить отзыв</h2>
              <ReviewForm onSubmit={handleSubmitReview} />
            </motion.div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReviewsPage;