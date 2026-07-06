// pages/delivery.js
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../lib/api';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  MapPinIcon,
  PhoneIcon 
} from '@heroicons/react/24/outline';

const DeliveryPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { cart, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const deliveryFee = 20; // Delivery fee in TJS
  const minOrderAmount = 100; // Minimum order amount

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    if (getCartTotal() < minOrderAmount) {
      toast.error(`Минимальная сумма заказа ${minOrderAmount} ${t('menu.currency')}`);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...data,
        items: cart,
        total: getCartTotal() + deliveryFee,
        deliveryFee,
        timestamp: new Date().toISOString()
      };

      await orderAPI.createOrder(orderData);
      
      toast.success(t('order.success'));
      clearCart();
      router.push('/');
    } catch (error) {
      toast.error(t('order.error'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">{t('order.empty')}</h2>
            <p className="text-gray-600 mb-8">
              Добавьте блюда из меню для оформления заказа
            </p>
            <button
              onClick={() => router.push('/menu')}
              className="btn-primary"
            >
              Перейти в меню
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">{t('order.title')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ShoppingBagIcon className="h-6 w-6 mr-2 text-primary-500" />
                  Ваш заказ
                </h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                      <img
                        src={item.image || '/images/placeholder-dish.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.price} {t('menu.currency')} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Сумма заказа</span>
                    <span>{getCartTotal()} {t('menu.currency')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span>{deliveryFee} {t('menu.currency')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>{t('order.total')}</span>
                    <span>{getCartTotal() + deliveryFee} {t('menu.currency')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Form */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TruckIcon className="h-6 w-6 mr-2 text-primary-500" />
                  Информация для доставки
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('order.form.name')}
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
                      {t('order.form.phone')}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('order.form.address')}
                    </label>
                    <textarea
                      rows={3}
                      {...register('address', { required: t('validation.required') })}
                      className="input"
                      placeholder="Улица, дом, квартира"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('order.form.comment')}
                    </label>
                    <textarea
                      rows={2}
                      {...register('comment')}
                      className="input"
                      placeholder="Комментарий к заказу..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || getCartTotal() < minOrderAmount}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Оформление...' : t('order.form.submit')}
                  </motion.button>

                  {getCartTotal() < minOrderAmount && (
                    <p className="text-sm text-red-500 text-center">
                      Минимальная сумма заказа {minOrderAmount} {t('menu.currency')}
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Информация о доставке</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Зона доставки</p>
                      <p className="text-gray-600">Город Худжанд и пригород</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TruckIcon className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Время доставки</p>
                      <p className="text-gray-600">30-45 минут</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Служба доставки</p>
                      <p className="text-gray-600">+992 92 777 77 77</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DeliveryPage;