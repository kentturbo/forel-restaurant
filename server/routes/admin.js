// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { menuDB, bookingsDB, ordersDB, reviewsDB, categoriesDB } = require('../services/database');

// Simple auth middleware (in production, use proper JWT authentication)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
  
  if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Apply auth to all admin routes
router.use(authMiddleware);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all data
    const [orders, bookings, reviews, menuItems] = await Promise.all([
      ordersDB.getAll(),
      bookingsDB.getAll(),
      reviewsDB.getAll(),
      menuDB.getAll()
    ]);
    
    // Today's stats
    const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
    const todayBookings = bookings.filter(b => b.date === today);
    
    const stats = {
      today: {
        orders: todayOrders.length,
        bookings: todayBookings.length,
        revenue: todayOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.total, 0)
      },
      total: {
        orders: orders.length,
        bookings: bookings.length,
        reviews: reviews.length,
        menuItems: menuItems.length,
        pendingReviews: reviews.filter(r => !r.approved).length,
        activeOrders: orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)).length
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Category management
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoriesDB.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { id, name_ru, name_en, icon, order } = req.body;
    
    const category = await categoriesDB.create({
      id,
      name_ru,
      name_en,
      icon,
      order: order || 0
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const updated = await categoriesDB.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const deleted = await categoriesDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data (backup)
router.get('/export', async (req, res) => {
  try {
    const data = {
      menu: await menuDB.getAll(),
      categories: await categoriesDB.getAll(),
      orders: await ordersDB.getAll(),
      bookings: await bookingsDB.getAll(),
      reviews: await reviewsDB.getAll(),
      exportDate: new Date().toISOString()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="forel-backup-${Date.now()}.json"`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { adminRoutes: router };