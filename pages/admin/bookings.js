// pages/admin/bookings.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
  pending: { label: 'Новая', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  confirmed: { label: 'Подтверждена', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Отменена', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  completed: { label: 'Завершена', color: 'bg-gray-100 text-gray-800', icon: CheckCircleIcon }
};

const AdminBookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchBookings(savedToken);
  }, [selectedDate]);

  const fetchBookings = async (authToken) => {
    try {
      const response = await fetch(`/api/booking/date/${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (!response.ok) {
        // If specific date endpoint fails, get all bookings
        const allResponse = await fetch('/api/booking', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const allData = await allResponse.json();
        const filtered = allData.filter(b => b.date === selectedDate);
        setBookings(filtered);
      } else {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      toast.error('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Статус обновлен');
        fetchBookings(token);
      }
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  // Group bookings by time
  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.time]) {
      acc[booking.time] = [];
    }
    acc[booking.time].push(booking);
    return acc;
  }, {});

  const sortedTimes = Object.keys(groupedBookings).sort();

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
              <h1 className="text-3xl font-bold text-gray-900">Управление бронированиями</h1>
              <p className="text-gray-600 mt-1">Всего на {new Date(selectedDate).toLocaleDateString('ru-RU')}: {bookings.length}</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="btn-secondary"
            >
              Назад
            </button>
          </div>

          {/* Date Picker */}
          <div className="card p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите дату
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input max-w-xs"
            />
          </div>

          {/* Bookings Timeline */}
          {sortedTimes.length > 0 ? (
            <div className="space-y-6">
              {sortedTimes.map(time => (
                <div key={time} className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-2 text-primary-500" />
                    {time}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedBookings[time].map(booking => {
                      const StatusIcon = statusConfig[booking.status || 'pending'].icon;
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-lg">{booking.name}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status || 'pending'].color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[booking.status || 'pending'].label}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-2" />
                              <a href={`tel:${booking.phone}`} className="hover:text-primary-500">
                                {booking.phone}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 mr-2" />
                              {booking.guests} {booking.guests === 1 ? 'гость' : booking.guests < 5 ? 'гостя' : 'гостей'}
                            </div>
                            {booking.comment && (
                              <p className="text-xs italic pt-2 border-t">
                                {booking.comment}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            {booking.status !== 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                              >
                                Подтвердить
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                              >
                                Отменить
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Нет бронирований на выбранную дату</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminBookingsPage;