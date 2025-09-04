const axios = require('axios');
const WebSocket = require('ws');

const API_BASE_URL = 'http://localhost:5000/api';
const WS_URL = 'ws://localhost:5000';

// Test data
const testUser1 = {
  username: 'testuser1',
  email: 'test1@example.com',
  password: 'Test123!',
};

const testUser2 = {
  username: 'testuser2',
  email: 'test2@example.com',
  password: 'Test123!',
};

let user1Token = '';
let user2Token = '';
let user1Id = '';
let user2Id = '';

// Helper function to make authenticated requests
const createAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Test registration
async function testRegistration() {
  console.log('Testing user registration...');
  
  try {
    // Register first user
    const res1 = await axios.post(`${API_BASE_URL}/auth/register`, testUser1);
    console.log('User 1 registered:', res1.data.user.username);
    user1Token = res1.data.token;
    user1Id = res1.data.user._id;
    
    // Register second user
    const res2 = await axios.post(`${API_BASE_URL}/auth/register`, testUser2);
    console.log('User 2 registered:', res2.data.user.username);
    user2Token = res2.data.token;
    user2Id = res2.data.user._id;
    
    return true;
  } catch (error) {
    console.error('Registration test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test login
async function testLogin() {
  console.log('\nTesting login...');
  
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser1.email,
      password: testUser1.password,
    });
    
    console.log('Login successful for:', res.data.user.username);
    return true;
  } catch (error) {
    console.error('Login test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test sending a message
async function testSendMessage() {
  console.log('\nTesting message sending...');
  
  try {
    const message = {
      receiverId: user2Id,
      content: 'Hello from test user 1!',
    };
    
    const res = await axios.post(
      `${API_BASE_URL}/messages`,
      message,
      createAuthHeaders(user1Token)
    );
    
    console.log('Message sent successfully:', res.data.content);
    return true;
  } catch (error) {
    console.error('Message sending test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test getting messages
async function testGetMessages() {
  console.log('\nTesting message retrieval...');
  
  try {
    const res = await axios.get(
      `${API_BASE_URL}/messages/${user1Id}`,
      createAuthHeaders(user2Token)
    );
    
    console.log('Messages retrieved:', res.data.length);
    if (res.data.length > 0) {
      console.log('Last message:', res.data[res.data.length - 1].content);
    }
    return true;
  } catch (error) {
    console.error('Message retrieval test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test WebSocket connection
function testWebSocket() {
  return new Promise((resolve) => {
    console.log('\nTesting WebSocket connection...');
    
    const ws = new WebSocket(`${WS_URL}/socket.io/?token=${user1Token}`);
    
    ws.on('open', () => {
      console.log('WebSocket connected');
      ws.close();
      resolve(true);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      resolve(false);
    });
  });
}

// Run all tests
async function runTests() {
  console.log('Starting backend tests...');
  
  const tests = [
    { name: 'Registration', fn: testRegistration },
    { name: 'Login', fn: testLogin },
    { name: 'Send Message', fn: testSendMessage },
    { name: 'Get Messages', fn: testGetMessages },
    { name: 'WebSocket', fn: testWebSocket },
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`\n=== ${test.name} Test ===`);
    const passed = await test.fn();
    console.log(`${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
    allPassed = allPassed && passed;
  }
  
  console.log('\n=== Test Summary ===');
  console.log(`All tests ${allPassed ? 'PASSED' : 'FAILED'}`);
  
  if (!allPassed) {
    process.exit(1);
  }
}

// Run the tests
runTests().catch(console.error);
