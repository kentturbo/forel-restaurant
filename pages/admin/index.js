// pages/admin/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { 
  ShoppingBagIcon, 
  CalendarIcon, 
  StarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check for admin token in localStorage
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchDashboardStats(savedToken);
  }, []);

  const fetchDashboardStats = async (authToken) => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Заказы сегодня',
      value: stats.today.orders,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Бронирования сегодня',
      value: stats.today.bookings,
      icon: CalendarIcon,
      color: 'bg-green-500',
      link: '/admin/bookings'
    },
    {
      title: 'Выручка сегодня',
      value: `${stats.today.revenue} сом`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Отзывы на модерации',
      value: stats.total.pendingReviews,
      icon: StarIcon,
      color: 'bg-purple-500',
      link: '/admin/reviews'
    }
  ] : [];

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
      <div className="bg-gray-100 min-h-screen">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
            <button
              onClick={() => router.push('/admin/menu/new')}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Добавить блюдо</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => stat.link && router.push(stat.link)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="text-gray-600">{stat.title}</h3>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin/menu')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Управление меню
                </button>
                <button
                  onClick={() => router.push('/admin/orders')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Активные заказы ({stats?.total.activeOrders || 0})
                </button>
                <button
                  onClick={() => router.push('/admin/bookings')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Бронирования
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Статистика</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Всего заказов:</span>
                  <span className="font-medium">{stats?.total.orders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Всего бронирований:</span>
                  <span className="font-medium">{stats?.total.bookings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Всего отзывов:</span>
                  <span className="font-medium">{stats?.total.reviews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Блюд в меню:</span>
                  <span className="font-medium">{stats?.total.menuItems || 0}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Система</h2>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/export', {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      const data = await response.blob();
                      const url = window.URL.createObjectURL(data);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup-${Date.now()}.json`;
                      a.click();
                      toast.success('Резервная копия создана');
                    } catch (error) {
                      toast.error('Ошибка создания резервной копии');
                    }
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                  <span>Создать резервную копию</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    router.push('/admin/login');
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-red-600"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;