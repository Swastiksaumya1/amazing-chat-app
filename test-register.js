const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRegister() {
  try {
    console.log('Testing registration...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testRegister();
