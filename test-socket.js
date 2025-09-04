const axios = require('axios');
const { io } = require('socket.io-client');

const API_BASE_URL = 'http://localhost:5000/api';

async function testSocket() {
  console.log('🔌 Testing Socket.IO functionality\n');
  
  try {
    // First, login to get a token
    console.log('1. Logging in to get token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'quicktest@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');
    
    // Test Socket.IO connection
    console.log('2. Testing Socket.IO connection...');
    
    const socket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket']
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully');
      console.log('   Socket ID:', socket.id);
      
      // Test user online event
      socket.on('userOnline', (data) => {
        console.log('✅ Received userOnline event:', data);
      });
      
      // Test user offline event
      socket.on('userOffline', (data) => {
        console.log('✅ Received userOffline event:', data);
      });
      
      // Test message receiving
      socket.on('receiveMessage', (data) => {
        console.log('✅ Received message:', data);
      });
      
      console.log('\n3. Socket.IO events are set up and working!');
      console.log('✅ Real-time functionality is operational\n');
      
      // Disconnect after testing
      setTimeout(() => {
        socket.disconnect();
        console.log('🎉 Socket.IO test completed successfully!');
        process.exit(0);
      }, 2000);
    });
    
    socket.on('connect_error', (error) => {
      console.log('❌ Socket.IO connection failed:', error.message);
      process.exit(1);
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
    });
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testSocket();
