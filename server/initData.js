// server/initData.js
const fs = require('fs').promises;
const path = require('path');
const { menuCategories, menuItems } = require('../data/mockData');

const initializeData = async () => {
  const dataDir = path.join(__dirname, 'data');
  
  // Ensure data directory exists
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }

  // Initialize categories.json
  const categoriesFile = path.join(dataDir, 'categories.json');
  try {
    const data = await fs.readFile(categoriesFile, 'utf8');
    const categories = JSON.parse(data);
    if (categories.length === 0) {
      throw new Error('Empty categories');
    }
  } catch {
    // Initialize with default categories
    const defaultCategories = menuCategories.ru.map((cat, index) => ({
      id: cat.id,
      name_ru: cat.name,
      name_en: menuCategories.en[index].name,
      icon: cat.icon,
      order: index,
      createdAt: new Date().toISOString()
    }));
    
    await fs.writeFile(categoriesFile, JSON.stringify(defaultCategories, null, 2));
    console.log('Initialized categories.json with default data');
  }

  // Initialize menu.json
  const menuFile = path.join(dataDir, 'menu.json');
  try {
    const data = await fs.readFile(menuFile, 'utf8');
    const menu = JSON.parse(data);
    if (menu.length === 0) {
      throw new Error('Empty menu');
    }
  } catch {
    // Initialize with default menu items
    const defaultMenu = menuItems.ru.map((item, index) => ({
      id: item.id,
      name_ru: item.name,
      name_en: menuItems.en && menuItems.en[index] ? menuItems.en[index].name : item.name,
      description_ru: item.description,
      description_en: menuItems.en && menuItems.en[index] ? menuItems.en[index].description : item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      popular: item.popular || false,
      available: true,
      createdAt: new Date().toISOString()
    }));
    
    await fs.writeFile(menuFile, JSON.stringify(defaultMenu, null, 2));
    console.log('Initialized menu.json with default data');
  }

  // Initialize other JSON files if empty
  const filesToInit = ['bookings.json', 'orders.json', 'reviews.json'];
  
  for (const filename of filesToInit) {
    const filepath = path.join(dataDir, filename);
    try {
      await fs.access(filepath);
    } catch {
      await fs.writeFile(filepath, '[]');
      console.log(`Initialized ${filename}`);
    }
  }
};

module.exports = { initializeData };