// pages/admin/menu/[id].js (for both new and edit)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../../../components/Layout';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

const AdminMenuEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    fetchCategories(savedToken);
    
    if (!isNew && id) {
      fetchMenuItem(savedToken, id);
    }
  }, [id]);

  const fetchCategories = async (authToken) => {
    try {
      const response = await fetch('/api/admin/categories', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItem = async (authToken, itemId) => {
    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      // Set form values
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
      
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });
      
      // Add image if selected
      const imageFile = document.getElementById('image').files[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = isNew 
        ? '/api/menu/items' 
        : `/api/menu/items/${id}`;
        
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success(isNew ? 'Блюдо добавлено' : 'Блюдо обновлено');
        router.push('/admin/menu');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push('/admin/menu')}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Добавить блюдо' : 'Редактировать блюдо'}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Russian Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название (РУ) *
                </label>
                <input
                  type="text"
                  {...register('name_ru', { required: 'Обязательное поле' })}
                  className="input"
                />
                {errors.name_ru && (
                  <p className="text-red-500 text-sm mt-1">{errors.name_ru.message}</p>
                )}
              </div>

              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название (EN) *
                </label>
                <input
                  type="text"
                  {...register('name_en', { required: 'Обязательное поле' })}
                  className="input"
                />
                {errors.name_en && (
                  <p className="text-red-500 text-sm mt-1">{errors.name_en.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  {...register('category', { required: 'Выберите категорию' })}
                  className="input"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ru}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (сом) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Обязательное поле',
                    min: { value: 0, message: 'Цена не может быть отрицательной' }
                  })}
                  className="input"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Russian Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание (РУ) *
                </label>
                <textarea
                  rows={3}
                  {...register('description_ru', { required: 'Обязательное поле' })}
                  className="input"
                />
                {errors.description_ru && (
                  <p className="text-red-500 text-sm mt-1">{errors.description_ru.message}</p>
                )}
              </div>

              {/* English Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание (EN) *
                </label>
                <textarea
                  rows={3}
                  {...register('description_en', { required: 'Обязательное поле' })}
                  className="input"
                />
                {errors.description_en && (
                  <p className="text-red-500 text-sm mt-1">{errors.description_en.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изображение
                </label>
                <div className="flex items-start space-x-6">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Рекомендуемый размер: 600x400px, максимум 5MB
                    </p>
                  </div>
                  
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('popular')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Популярное блюдо
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('available')}
                    defaultChecked={true}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Доступно для заказа
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/menu')}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminMenuEditPage;