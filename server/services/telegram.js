// server/services/telegram.js
const formatBookingMessage = (booking) => {
  return `
🔔 *Новое бронирование!*

👤 *Имя:* ${booking.name}
📱 *Телефон:* ${booking.phone}
📅 *Дата:* ${booking.date}
🕐 *Время:* ${booking.time}
👥 *Гостей:* ${booking.guests}
💬 *Комментарий:* ${booking.comment || 'Нет'}

#бронирование
`;
};

const formatOrderMessage = (order) => {
  const itemsList = order.items.map(item => 
    `  • ${item.name} x${item.quantity} - ${item.price * item.quantity} сом`
  ).join('\n');

  return `
🛵 *Новый заказ доставки!*

👤 *Имя:* ${order.name}
📱 *Телефон:* ${order.phone}
📍 *Адрес:* ${order.address}

🛒 *Заказ:*
${itemsList}

💰 *Сумма заказа:* ${order.total - order.deliveryFee} сом
🚚 *Доставка:* ${order.deliveryFee} сом
💳 *Итого:* ${order.total} сом

💬 *Комментарий:* ${order.comment || 'Нет'}

#доставка #заказ${order.id}
`;
};

const formatReviewMessage = (review) => {
  const stars = '⭐'.repeat(review.rating);
  
  return `
💬 *Новый отзыв!*

👤 *Имя:* ${review.name}
${stars} *Оценка:* ${review.rating}/5

📝 *Отзыв:*
${review.comment}

#отзыв
`;
};

const sendNotification = async (bot, chatId, message) => {
  // Skip if bot is not configured
  if (!bot || !chatId) {
    console.log('Telegram notification skipped (bot not configured)');
    return true;
  }

  try {
    await bot.sendMessage(chatId, message, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    });
    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error.message);
    return false;
  }
};

module.exports = {
  formatBookingMessage,
  formatOrderMessage,
  formatReviewMessage,
  sendNotification
};