// server/routes/booking.js
const express = require('express');
const router = express.Router();
const { bookingsDB } = require('../services/database');
const { formatBookingMessage, sendNotification } = require('../services/telegram');

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingsDB.getAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, date, time, guests, comment } = req.body;
    
    // Validate required fields
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create booking
    const booking = await bookingsDB.create({
      name,
      phone,
      date,
      time,
      guests: parseInt(guests),
      comment,
      status: 'pending'
    });
    
    // Send Telegram notification
    const message = formatBookingMessage(booking);
    await sendNotification(req.bot, req.chatId, message);
    
    res.status(201).json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await bookingsDB.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updated = await bookingsDB.update(req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for specific date (admin)
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await bookingsDB.filter(booking => booking.date === date);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { bookingRoutes: router };