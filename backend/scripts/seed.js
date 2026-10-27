require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { Recipe } = require('../models/Recipe');
const sampleRecipes = require('./sampleRecipes');

const runSeed = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('❌ Error: Please set your real MongoDB Atlas connection string in backend/.env before running the manual seed script.');
    console.log('Example: MONGO_URI=mongodb+srv://admin:mypassword@cluster0.mongodb.net/recipebook?retryWrites=true&w=majority');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB.');

    const count = await Recipe.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} recipe(s).`);
      console.log('To prevent accidental data loss, seed script only inserts if DB is empty.');
      console.log('If you want to re-seed, clear recipes first or drop the collection.');
    } else {
      console.log('Seeding 3 sample recipes...');
      const created = await Recipe.insertMany(sampleRecipes);
      console.log(`✅ Successfully seeded ${created.length} recipes!`);
    }

    await mongoose.connection.close();
    console.log('Disconnected. Seed script complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

runSeed();
