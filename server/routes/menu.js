// server/routes/menu.js
const express = require('express');
const router = express.Router();
const { menuDB, categoriesDB } = require('../services/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'menu');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoriesDB.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const { category, locale = 'ru' } = req.query;
    let items = await menuDB.getAll();
    
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }
    
    // Transform items based on locale
    const transformedItems = items.map(item => ({
      id: item.id,
      name: item[`name_${locale}`] || item.name_ru,
      description: item[`description_${locale}`] || item.description_ru,
      price: item.price,
      category: item.category,
      image: item.image,
      popular: item.popular,
      available: item.available !== false
    }));
    
    res.json(transformedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single menu item
router.get('/items/:id', async (req, res) => {
  try {
    const item = await menuDB.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create menu item (admin)
router.post('/items', upload.single('image'), async (req, res) => {
  try {
    const { name_ru, name_en, description_ru, description_en, price, category, popular } = req.body;
    
    const newItem = await menuDB.create({
      name_ru,
      name_en,
      description_ru,
      description_en,
      price: parseFloat(price),
      category,
      popular: popular === 'true',
      image: req.file ? `/uploads/menu/${req.file.filename}` : null,
      available: true
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item (admin)
router.put('/items/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.file) {
      updates.image = `/uploads/menu/${req.file.filename}`;
    }
    
    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }
    
    if (updates.popular) {
      updates.popular = updates.popular === 'true';
    }
    
    const updated = await menuDB.update(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item (admin)
router.delete('/items/:id', async (req, res) => {
  try {
    const deleted = await menuDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { menuRoutes: router };