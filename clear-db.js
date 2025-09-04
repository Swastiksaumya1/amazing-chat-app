const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all collections
    const collections = await mongoose.connection.db.collections();

    // Drop each collection
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log("✅ Database cleared successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    process.exit(1);
  }
}

clearDatabase();
