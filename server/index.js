// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const { initializeData } = require('./initData');
const { menuRoutes } = require('./routes/menu');
const { bookingRoutes } = require('./routes/booking');
const { orderRoutes } = require('./routes/orders');
const { reviewRoutes } = require('./routes/reviews');
const { adminRoutes } = require('./routes/admin');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize data on server start
initializeData().catch(console.error);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'menu');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Telegram Bot Setup - only if credentials are provided
let bot = null;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here') {
  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('Telegram bot initialized');
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error.message);
  }
} else {
  console.log('Telegram bot not configured - skipping initialization');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Make bot available to routes
app.use((req, res, next) => {
  req.bot = bot;
  req.chatId = CHAT_ID;
  next();
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Telegram bot is active');
});

// Bot commands
if (bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
      'Добро пожаловать в Ресторан Форель! 🐟\n\n' +
      'Я помогу вам с:\n' +
      '• Бронированием столиков\n' +
      '• Заказом доставки\n' +
      '• Информацией о меню\n\n' +
      'Используйте команды:\n' +
      '/menu - Посмотреть меню\n' +
      '/book - Забронировать столик\n' +
      '/contact - Контакты'
    );
  });

  bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
      'Наше меню доступно на сайте:\n' +
      'https://forel-restaurant.tj/menu\n\n' +
      'Или позвоните нам: +992 92 777 77 77'
    );
  });
}

module.exports = { app, bot };