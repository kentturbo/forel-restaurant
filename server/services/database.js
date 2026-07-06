// server/services/database.js
const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor(filename) {
    this.filename = path.join(__dirname, '..', 'data', `${filename}.json`);
    this.initDatabase();
  }

  async initDatabase() {
    try {
      await fs.access(this.filename);
    } catch {
      // Create directory if it doesn't exist
      const dir = path.dirname(this.filename);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.filename, '[]');
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return [];
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.filename, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing to database:', error);
      return false;
    }
  }

  async getAll() {
    return await this.read();
  }

  async getById(id) {
    const data = await this.read();
    return data.find(item => item.id === id);
  }

  async create(item) {
    const data = await this.read();
    const newItem = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...item
    };
    data.push(newItem);
    await this.write(data);
    return newItem;
  }

  async update(id, updates) {
    const data = await this.read();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.write(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.read();
    const filtered = data.filter(item => item.id !== id);
    if (filtered.length === data.length) return false;
    
    await this.write(filtered);
    return true;
  }

  async filter(predicate) {
    const data = await this.read();
    return data.filter(predicate);
  }
}

// Initialize databases
const menuDB = new Database('menu');
const bookingsDB = new Database('bookings');
const ordersDB = new Database('orders');
const reviewsDB = new Database('reviews');
const categoriesDB = new Database('categories');

module.exports = {
  menuDB,
  bookingsDB,
  ordersDB,
  reviewsDB,
  categoriesDB
};