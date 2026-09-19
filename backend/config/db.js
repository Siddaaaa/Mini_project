const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri === 'memory') {
      console.log('⚡ Starting in-memory MongoDB Server...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB running at ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If external connection failed, try fallback to memory server
    if (!mongoServer) {
      try {
        console.log('🔄 Attempting fallback to In-Memory MongoDB...');
        mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.error(`❌ Fallback MongoDB Error: ${fallbackErr.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
