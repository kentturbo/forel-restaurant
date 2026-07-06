// data/mockData.js
export const menuCategories = {
  ru: [
    { id: 'appetizers', name: 'Закуски', icon: '🥗' },
    { id: 'salads', name: 'Салаты', icon: '🥙' },
    { id: 'soups', name: 'Супы', icon: '🍲' },
    { id: 'main', name: 'Основные блюда', icon: '🍽️' },
    { id: 'fish', name: 'Рыбные блюда', icon: '🐟' },
    { id: 'desserts', name: 'Десерты', icon: '🍰' },
    { id: 'drinks', name: 'Напитки', icon: '🥤' },
  ],
  en: [
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'salads', name: 'Salads', icon: '🥙' },
    { id: 'soups', name: 'Soups', icon: '🍲' },
    { id: 'main', name: 'Main Courses', icon: '🍽️' },
    { id: 'fish', name: 'Fish Dishes', icon: '🐟' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Beverages', icon: '🥤' },
  ]
};

export const menuItems = {
  ru: [
    // Fish dishes
    {
      id: '1',
      name: 'Форель на гриле',
      description: 'Свежая форель, приготовленная на гриле с травами и лимоном',
      price: 250,
      category: 'fish',
      image: '/images/dishes/grilled-trout.jpg',
      popular: true
    },
    {
      id: '2',
      name: 'Форель в сливочном соусе',
      description: 'Нежная форель в сливочном соусе с шпинатом',
      price: 280,
      category: 'fish',
      image: '/images/dishes/trout-cream.jpg'
    },
    // Salads
    {
      id: '3',
      name: 'Цезарь с курицей',
      description: 'Классический салат с курицей, сыром пармезан и соусом',
      price: 120,
      category: 'salads',
      image: '/images/dishes/caesar.jpg'
    },
    {
      id: '4',
      name: 'Греческий салат',
      description: 'Свежие овощи, оливки, сыр фета и оливковое масло',
      price: 100,
      category: 'salads',
      image: '/images/dishes/greek.jpg'
    },
    // Soups
    {
      id: '5',
      name: 'Борщ',
      description: 'Традиционный борщ со сметаной и чесночными пампушками',
      price: 80,
      category: 'soups',
      image: '/images/dishes/borscht.jpg'
    },
    {
      id: '6',
      name: 'Уха из форели',
      description: 'Ароматный рыбный суп из свежей форели',
      price: 120,
      category: 'soups',
      image: '/images/dishes/fish-soup.jpg',
      popular: true
    },
    // Main courses
    {
      id: '7',
      name: 'Стейк из говядины',
      description: 'Сочный стейк средней прожарки с овощами гриль',
      price: 350,
      category: 'main',
      image: '/images/dishes/steak.jpg'
    },
    {
      id: '8',
      name: 'Плов',
      description: 'Традиционный плов с бараниной и специями',
      price: 180,
      category: 'main',
      image: '/images/dishes/plov.jpg'
    },
    // Appetizers
    {
      id: '9',
      name: 'Брускетта с томатами',
      description: 'Хрустящие тосты с томатами, базиликом и моцареллой',
      price: 90,
      category: 'appetizers',
      image: '/images/dishes/bruschetta.jpg'
    },
    // Desserts
    {
      id: '10',
      name: 'Тирамису',
      description: 'Классический итальянский десерт',
      price: 120,
      category: 'desserts',
      image: '/images/dishes/tiramisu.jpg'
    },
    // Drinks
    {
      id: '11',
      name: 'Свежевыжатый апельсиновый сок',
      description: '100% натуральный сок',
      price: 60,
      category: 'drinks',
      image: '/images/dishes/orange-juice.jpg'
    }
  ],
  en: [
    // Same items with English translations
    {
      id: '1',
      name: 'Grilled Trout',
      description: 'Fresh trout grilled with herbs and lemon',
      price: 250,
      category: 'fish',
      image: '/images/dishes/grilled-trout.jpg',
      popular: true
    },
    // ... (add English versions of all items)
  ]
};

export const reviews = [
  {
    id: '1',
    name: 'Александр',
    rating: 5,
    comment: 'Отличный ресторан! Форель просто тает во рту.',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Мария',
    rating: 5,
    comment: 'Уютная атмосфера и вкусная еда. Рекомендую!',
    date: '2024-01-10'
  },
  {
    id: '3',
    name: 'Дмитрий',
    rating: 4,
    comment: 'Хорошее обслуживание, большие порции.',
    date: '2024-01-05'
  }
];

// Export for CommonJS (Node.js server)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    menuCategories,
    menuItems,
    reviews
  };
}

