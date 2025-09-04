const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function quickTest() {
  console.log('🚀 Quick Chat App Test\n');
  
  try {
    // Test 1: Basic server connection
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:5000');
    console.log('✅ Server is running\n');
    
    // Test 2: User registration
    console.log('2. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: 'Quick Test User',
        email: 'quicktest@example.com',
        password: 'password123'
      });
      console.log('✅ Registration successful');
      console.log('   User:', registerResponse.data.name);
      console.log('   Token received:', !!registerResponse.data.token);
    } catch (err) {
      if (err.response?.data?.message === 'User already exists') {
        console.log('✅ Registration endpoint working (user already exists)');
      } else {
        console.log('❌ Registration failed:', err.response?.data?.message || err.message);
      }
    }
    
    // Test 3: User login
    console.log('\n3. Testing user login...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'quicktest@example.com',
        password: 'password123'
      });
      console.log('✅ Login successful');
      console.log('   User:', loginResponse.data.name);
      console.log('   Token received:', !!loginResponse.data.token);
      
      const token = loginResponse.data.token;
      
      // Test 4: Get current user
      console.log('\n4. Testing get current user...');
      try {
        const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Get current user successful');
        console.log('   User:', meResponse.data.name);
      } catch (err) {
        console.log('❌ Get current user failed:', err.response?.data?.message || err.message);
      }
      
      // Test 5: Get all users
      console.log('\n5. Testing get all users...');
      try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Get users successful');
        console.log('   Users found:', usersResponse.data.length);
      } catch (err) {
        console.log('❌ Get users failed:', err.response?.data?.message || err.message);
      }
      
    } catch (err) {
      console.log('❌ Login failed:', err.response?.data?.message || err.message);
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('Make sure the backend server is running on http://localhost:5000');
  }
}

quickTest();
