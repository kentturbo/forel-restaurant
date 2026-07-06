// server/routes/orders.js
const express = require('express');
const router = express.Router();
const { ordersDB } = require('../services/database');
const { formatOrderMessage, sendNotification } = require('../services/telegram');

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let orders = await ordersDB.getAll();
    
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, items, total, deliveryFee, comment } = req.body;
    
    // Validate required fields
    if (!name || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-6);
    
    // Create order
    const order = await ordersDB.create({
      orderNumber,
      name,
      phone,
      address,
      items,
      total: parseFloat(total),
      deliveryFee: parseFloat(deliveryFee),
      comment,
      status: 'pending',
      paymentMethod: 'cash',
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    });
    
    // Send Telegram notification
    const message = formatOrderMessage(order);
    await sendNotification(req.bot, req.chatId, message);
    
    res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await ordersDB.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updates = { status };
    
    // Add timestamps for specific statuses
    if (status === 'confirmed') {
      updates.confirmedAt = new Date().toISOString();
    } else if (status === 'delivered') {
      updates.deliveredAt = new Date().toISOString();
    }
    
    const updated = await ordersDB.update(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Notify customer via Telegram bot (if integrated)
    // This could be expanded to send status updates to customers
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's orders (admin)
router.get('/stats/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const orders = await ordersDB.filter(order => 
      order.createdAt && order.createdAt.startsWith(today)
    );
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { orderRoutes: router };