// pages/admin/orders.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
  pending: { label: 'Новый', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
  preparing: { label: 'Готовится', color: 'bg-purple-100 text-purple-800', icon: ClockIcon },
  delivering: { label: 'Доставляется', color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon },
  delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800', icon: XCircleIcon }
};

const AdminOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [token, setToken] = useState('');
  const [filter, setFilter] = useState('active'); // active, all, today

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchOrders(savedToken);
  }, []);

  const fetchOrders = async (authToken) => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      // Sort by creation date, newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (error) {
      toast.error('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Статус обновлен');
        fetchOrders(token);
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const getFilteredOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
      case 'active':
        return orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status));
      case 'today':
        return orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

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
              <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
              <p className="text-gray-600 mt-1">Активных заказов: {orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)).length}</p>
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
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'active'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'today'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Сегодня
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Все заказы
            </button>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map(order => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusConfig[order.status].label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {order.phone}
                    </div>
                    <div className="flex items-start text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <span className="line-clamp-2">{order.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Сумма:</span>
                      <span className="font-semibold text-lg">{order.total} сом</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет заказов для отображения</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Заказ #{selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Информация о клиенте</h3>
                  <p><strong>Имя:</strong> {selectedOrder.name}</p>
                  <p><strong>Телефон:</strong> {selectedOrder.phone}</p>
                  <p><strong>Адрес:</strong> {selectedOrder.address}</p>
                  {selectedOrder.comment && (
                    <p><strong>Комментарий:</strong> {selectedOrder.comment}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Информация о заказе</h3>
                  <p><strong>Создан:</strong> {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}</p>
                  <p><strong>Статус:</strong> {statusConfig[selectedOrder.status].label}</p>
                  <p><strong>Сумма:</strong> {selectedOrder.total} сом</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Состав заказа</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{item.price * item.quantity} сом</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span>Доставка</span>
                    <span>{selectedOrder.deliveryFee} сом</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Итого</span>
                    <span>{selectedOrder.total} сом</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Изменить статус</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default AdminOrdersPage;