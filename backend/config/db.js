const mongoose = require('mongoose');
const { Recipe } = require('../models/Recipe');
const sampleRecipes = require('../scripts/sampleRecipes');

let memoryServerInstance = null;

/**
 * Automatically seeds the database if empty
 */
const seedDatabaseIfEmpty = async () => {
  try {
    const count = await Recipe.countDocuments();
    if (count === 0) {
      console.log('📦 Database is currently empty. Seeding 3 sample recipes...');
      await Recipe.insertMany(sampleRecipes);
      console.log('✅ Successfully seeded 3 sample recipes.');
    } else {
      console.log(`ℹ️ Database already has ${count} recipe(s). Skipping automatic seed.`);
    }
  } catch (seedErr) {
    console.error('⚠️ Could not auto-seed database:', seedErr.message);
  }
};

/**
 * Connect to MongoDB Atlas, local MongoDB, or in-memory fallback
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  const isPlaceholder = !uri || uri.includes('<username>') || uri.includes('<password>');

  if (isPlaceholder) {
    console.log('⚠️ [Notice] MONGO_URI contains placeholder credentials (<username>:<password>).');
    console.log('👉 To connect your real MongoDB Atlas cluster, edit backend/.env and replace the placeholder.');
    console.log('🚀 Initializing in-memory MongoDB server for instant zero-config execution...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      uri = memoryServerInstance.getUri();
      console.log(`✨ In-memory MongoDB started at: ${uri}`);
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Check and seed if empty
    await seedDatabaseIfEmpty();

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Graceful shutdown hook for in-memory DB or active connection
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    console.log('🔌 MongoDB connection closed gracefully.');
  } catch (err) {
    console.error('Error during database disconnect:', err.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  seedDatabaseIfEmpty
};
