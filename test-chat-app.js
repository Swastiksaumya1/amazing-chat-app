const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser1 = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  password: 'password123'
};

const testUser2 = {
  name: 'Bob Smith',
  email: 'bob@example.com',
  password: 'password123'
};

let user1Token = '';
let user2Token = '';
let user1Id = '';
let user2Id = '';

// Helper function to create auth headers
const createAuthHeaders = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Test user registration
async function testRegister() {
  console.log('\n🔐 Testing user registration...');
  
  try {
    // Register user 1
    const res1 = await axios.post(`${API_BASE_URL}/auth/register`, testUser1);
    user1Token = res1.data.token;
    user1Id = res1.data._id;
    console.log('✅ User 1 registered successfully:', res1.data.name);
    
    // Register user 2
    const res2 = await axios.post(`${API_BASE_URL}/auth/register`, testUser2);
    user2Token = res2.data.token;
    user2Id = res2.data._id;
    console.log('✅ User 2 registered successfully:', res2.data.name);
    
    return true;
  } catch (error) {
    console.error('❌ Registration test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test user login
async function testLogin() {
  console.log('\n🔑 Testing user login...');
  
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser1.email,
      password: testUser1.password
    });
    
    console.log('✅ Login successful for:', res.data.name);
    return true;
  } catch (error) {
    console.error('❌ Login test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test getting current user
async function testGetCurrentUser() {
  console.log('\n👤 Testing get current user...');
  
  try {
    const res = await axios.get(
      `${API_BASE_URL}/auth/me`,
      createAuthHeaders(user1Token)
    );
    
    console.log('✅ Current user retrieved:', res.data.name);
    return true;
  } catch (error) {
    console.error('❌ Get current user test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test getting all users
async function testGetUsers() {
  console.log('\n👥 Testing get all users...');
  
  try {
    const res = await axios.get(
      `${API_BASE_URL}/users`,
      createAuthHeaders(user1Token)
    );
    
    console.log('✅ Users retrieved:', res.data.length, 'users found');
    return true;
  } catch (error) {
    console.error('❌ Get users test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test getting messages (should be empty initially)
async function testGetMessages() {
  console.log('\n💬 Testing get messages...');
  
  try {
    const res = await axios.get(
      `${API_BASE_URL}/messages/${user2Id}`,
      createAuthHeaders(user1Token)
    );
    
    console.log('✅ Messages retrieved:', res.data.length, 'messages found');
    return true;
  } catch (error) {
    console.error('❌ Get messages test failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Chat App API Tests...\n');
  
  const tests = [
    { name: 'Register Users', fn: testRegister },
    { name: 'Login User', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Get All Users', fn: testGetUsers },
    { name: 'Get Messages', fn: testGetMessages }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your chat app backend is working correctly.');
    console.log('\n🌐 You can now open http://localhost:3000 in your browser to test the frontend.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

// Run the tests
runTests().catch(console.error);
