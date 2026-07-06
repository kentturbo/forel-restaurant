// components/MenuCard.js
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

const MenuCard = ({ item }) => {
  const { t } = useTranslation('common');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image || '/images/placeholder-dish.jpg'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {item.name}
        </h3>
        <p className="text-gray-600 mb-4 flex-1">
          {item.description}
        </p>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-sm text-gray-500">{t('menu.price')}</span>
            <p className="text-2xl font-bold text-primary-500">
              {item.price} <span className="text-base font-normal">{t('menu.currency')}</span>
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>{t('menu.addToCart')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;