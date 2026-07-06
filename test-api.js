// test-api.js - Test script to verify API endpoints
const axios = require('axios');

const API_URL = 'http://localhost:5000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';

console.log('🧪 Testing Restaurant Forel API Endpoints...\n');

async function testEndpoints() {
  let passed = 0;
  let failed = 0;

  // Test 1: Health check
  try {
    const res = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check: OK');
    passed++;
  } catch (error) {
    console.log('❌ Health check: FAILED');
    failed++;
  }

  // Test 2: Get menu categories
  try {
    const res = await axios.get(`${API_URL}/api/menu/categories`);
    console.log(`✅ Menu categories: ${res.data.length} categories found`);
    passed++;
  } catch (error) {
    console.log('❌ Menu categories: FAILED');
    failed++;
  }

  // Test 3: Get menu items
  try {
    const res = await axios.get(`${API_URL}/api/menu/items`);
    console.log(`✅ Menu items: ${res.data.length} items found`);
    passed++;
  } catch (error) {
    console.log('❌ Menu items: FAILED');
    failed++;
  }

  // Test 4: Get reviews
  try {
    const res = await axios.get(`${API_URL}/api/reviews`);
    console.log(`✅ Reviews: ${res.data.length} reviews found`);
    passed++;
  } catch (error) {
    console.log('❌ Reviews: FAILED');
    failed++;
  }

  // Test 5: Admin dashboard (requires auth)
  try {
    const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
    });
    console.log('✅ Admin dashboard: Authenticated successfully');
    passed++;
  } catch (error) {
    console.log('❌ Admin dashboard: Authentication failed (check ADMIN_TOKEN)');
    failed++;
  }

  // Test 6: Create a test booking
  try {
    const bookingData = {
      name: 'Test User',
      phone: '+992 92 123 45 67',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: 2,
      comment: 'API test booking'
    };
    const res = await axios.post(`${API_URL}/api/booking`, bookingData);
    console.log('✅ Create booking: Success');
    passed++;
  } catch (error) {
    console.log('❌ Create booking: FAILED');
    failed++;
  }

  // Test 7: Create a test review
  try {
    const reviewData = {
      name: 'Test Reviewer',
      rating: 5,
      comment: 'Excellent service! (API test)'
    };
    const res = await axios.post(`${API_URL}/api/reviews`, reviewData);
    console.log('✅ Create review: Success (pending moderation)');
    passed++;
  } catch (error) {
    console.log('❌ Create review: FAILED');
    failed++;
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! The API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server logs.');
  }
}

// Check if server is running
axios.get(`${API_URL}/api/health`)
  .then(() => {
    testEndpoints();
  })
  .catch(() => {
    console.log('❌ Cannot connect to API server at', API_URL);
    console.log('   Make sure the backend server is running: node server/index.js');
  });