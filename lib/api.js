// lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu API
export const menuAPI = {
  getCategories: async (locale = 'ru') => {
    try {
      const { data } = await api.get(`/api/menu/categories?locale=${locale}`);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getItems: async (category = null, locale = 'ru') => {
    try {
      const url = category 
        ? `/api/menu/items?category=${category}&locale=${locale}`
        : `/api/menu/items?locale=${locale}`;
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },
};

// Booking API
export const bookingAPI = {
  createBooking: async (bookingData) => {
    try {
      const { data } = await api.post('/api/booking', bookingData);
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    try {
      const { data } = await api.post('/api/orders', orderData);
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};

// Reviews API
export const reviewsAPI = {
  getReviews: async () => {
    try {
      const { data } = await api.get('/api/reviews');
      return data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  createReview: async (reviewData) => {
    try {
      const { data } = await api.post('/api/reviews', reviewData);
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
};

export default api;