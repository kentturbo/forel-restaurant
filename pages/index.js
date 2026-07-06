// pages/index.js
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon,
  StarIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const features = [
    {
      icon: ClockIcon,
      title: 'Быстрая доставка',
      description: 'Доставим ваш заказ в течение 45 минут'
    },
    {
      icon: StarIcon,
      title: 'Премиум качество',
      description: 'Только свежие продукты от проверенных поставщиков'
    },
    {
      icon: MapPinIcon,
      title: 'Удобное расположение',
      description: 'В самом центре города с парковкой'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
          <img 
            src="/images/restaurant-facade.jpg" 
            alt="Restaurant Forel"
            className="w-full h-full object-cover"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center text-white container-custom"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/booking')}
              className="btn-primary"
            >
              {t('hero.book')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/menu')}
              className="btn-secondary bg-white/90 backdrop-blur"
            >
              {t('hero.viewMenu')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/delivery')}
              className="btn-secondary bg-white/90 backdrop-blur"
            >
              {t('hero.order')}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <feature.icon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">О нашем ресторане</h2>
              <p className="text-gray-600 mb-4">
                Ресторан "Форель" - это уютное место в самом сердце Худжанда, где 
                традиции встречаются с современностью. Мы гордимся нашей кухней, 
                которая сочетает в себе лучшие рецепты национальной и европейской кухни.
              </p>
              <p className="text-gray-600 mb-6">
                Наша специализация - блюда из свежей рыбы, особенно форели, которую 
                мы получаем из горных рек. Каждое блюдо готовится с любовью и 
                вниманием к деталям.
              </p>
              <button 
                onClick={() => router.push('/menu')}
                className="btn-primary"
              >
                Посмотреть меню
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img 
                src="/images/interior-1.jpg" 
                alt="Restaurant interior" 
                className="rounded-lg shadow-lg"
              />
              <img 
                src="/images/dish-1.jpg" 
                alt="Signature dish" 
                className="rounded-lg shadow-lg mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Готовы сделать заказ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Закажите доставку или забронируйте столик прямо сейчас
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/delivery')}
                className="px-8 py-3 bg-white text-primary-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Заказать доставку
              </button>
              <button 
                onClick={() => router.push('/booking')}
                className="px-8 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-white hover:text-primary-500 transition-colors"
              >
                Забронировать столик
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;