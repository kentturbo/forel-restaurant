// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const AdminLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In production, this should be a proper authentication endpoint
      // For now, we just check against the token directly
      const adminToken = data.token;
      
      // Test the token by making a request
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.ok) {
        // Save token and redirect
        localStorage.setItem('adminToken', adminToken);
        toast.success('Вход выполнен успешно');
        router.push('/admin');
      } else {
        toast.error('Неверный токен доступа');
      }
    } catch (error) {
      toast.error('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Вход в панель управления
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ресторан Форель
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Токен доступа
            </label>
            <input
              type="password"
              {...register('token', { required: 'Введите токен доступа' })}
              className="mt-1 input"
              placeholder="Введите токен администратора"
            />
            {errors.token && (
              <p className="text-red-500 text-sm mt-1">{errors.token.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="text-center">
          <a
            href="/"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;