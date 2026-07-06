// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const { reviewsDB } = require('../services/database');
const { formatReviewMessage, sendNotification } = require('../services/telegram');

// Get all approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await reviewsDB.filter(review => 
      review.approved !== false
    );
    
    // Sort by date, newest first
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews including unapproved (admin)
router.get('/all', async (req, res) => {
  try {
    const reviews = await reviewsDB.getAll();
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new review
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    
    // Validate required fields
    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Create review
    const review = await reviewsDB.create({
      name,
      rating: ratingNum,
      comment,
      approved: false, // Reviews need approval before being shown
      date: new Date().toISOString()
    });
    
    // Send Telegram notification
    const message = formatReviewMessage(review);
    await sendNotification(req.bot, req.chatId, message);
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully and will be published after moderation' 
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject review (admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const { approved } = req.body;
    
    const updated = await reviewsDB.update(req.params.id, { 
      approved: approved === true,
      moderatedAt: new Date().toISOString()
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review (admin)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await reviewsDB.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get review statistics
router.get('/stats', async (req, res) => {
  try {
    const reviews = await reviewsDB.filter(review => review.approved !== false);
    
    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { reviewRoutes: router };