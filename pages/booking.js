// pages/booking.js
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { bookingAPI } from '../lib/api';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const BookingPage = () => {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await bookingAPI.createBooking(data);
      toast.success(t('booking.success'));
      reset();
    } catch (error) {
      toast.error(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

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
              {t('booking.title')}
            </h1>
            <p className="text-lg text-gray-700">
              Забронируйте столик онлайн за несколько секунд
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary-500" />
                  {t('booking.form.date')}
                </label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  {...register('date', { required: t('validation.required') })}
                  className="input"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-primary-500" />
                  {t('booking.form.time')}
                </label>
                <select
                  {...register('time', { required: t('validation.required') })}
                  className="input"
                >
                  <option value="">Выберите время</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>

              {/* Number of guests */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-primary-500" />
                  {t('booking.form.guests')}
                </label>
                <select
                  {...register('guests', { required: t('validation.required') })}
                  className="input"
                >
                  <option value="">Выберите количество</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}
                    </option>
                  ))}
                </select>
                {errors.guests && (
                  <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.form.name')}
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.form.phone')}
                </label>
                <input
                  type="tel"
                  placeholder="+992 XX XXX XX XX"
                  {...register('phone', {
                    required: t('validation.required'),
                    pattern: {
                      value: /^(\+992|992)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
                      message: t('validation.phone')
                    }
                  })}
                  className="input"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.form.comment')}
                </label>
                <textarea
                  rows={3}
                  {...register('comment')}
                  className="input"
                  placeholder="Особые пожелания..."
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Отправка...' : t('booking.form.submit')}
              </motion.button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-gray-600"
          >
            <p>Или позвоните нам для бронирования:</p>
            <a href="tel:+992927777777" className="text-2xl font-bold text-primary-500 hover:text-primary-600">
              +992 92 777 77 77
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;