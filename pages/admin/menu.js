// pages/admin/menu.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

const AdminMenuPage = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchData(savedToken);
  }, []);

  const fetchData = async (authToken) => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/menu/items', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/admin/categories', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      const items = await itemsRes.json();
      const cats = await categoriesRes.json();
      
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: !currentStatus })
      });

      if (response.ok) {
        toast.success('Статус обновлен');
        fetchData(token);
      }
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm('Удалить это блюдо?')) return;

    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Блюдо удалено');
        fetchData(token);
      }
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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
              <h1 className="text-3xl font-bold text-gray-900">Управление меню</h1>
              <p className="text-gray-600 mt-1">Всего блюд: {menuItems.length}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="btn-secondary"
              >
                Назад
              </button>
              <button
                onClick={() => router.push('/admin/menu/new')}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Добавить блюдо</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Все блюда
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.name_ru}
              </button>
            ))}
          </div>

          {/* Menu Items Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Блюдо
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Категория
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.image || '/images/placeholder-dish.jpg'}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {categories.find(c => c.id === item.category)?.name_ru || item.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.price} сом
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAvailability(item.id, item.available)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.available ? (
                            <>
                              <EyeIcon className="h-4 w-4 mr-1" />
                              Доступно
                            </>
                          ) : (
                            <>
                              <EyeSlashIcon className="h-4 w-4 mr-1" />
                              Скрыто
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/menu/${item.id}`)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMenuPage;