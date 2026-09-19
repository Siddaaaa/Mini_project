const dotenv = require('dotenv');
const Pet = require('./models/Pet');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const clearDatabase = async () => {
  try {
    await connectDB();
    const petResult = await Pet.deleteMany({});
    const taskResult = await Task.deleteMany({});

    console.log('✨ Database cleared successfully!');
    console.log(`🗑️ Deleted ${petResult.deletedCount} pets.`);
    console.log(`🗑️ Deleted ${taskResult.deletedCount} tasks.`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error clearing database: ${error.message}`);
    process.exit(1);
  }
};

clearDatabase();
