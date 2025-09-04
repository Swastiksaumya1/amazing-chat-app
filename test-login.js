const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function testLogin() {
  try {
    console.log("Testing login...");

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });

    console.log("✅ Login successful!");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("❌ Login failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
}

testLogin();
