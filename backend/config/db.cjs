const mongoose = require("mongoose");
let MongoMemoryServer;

try {
  const mms = require("mongodb-memory-server");
  MongoMemoryServer = mms.MongoMemoryServer;
} catch (e) {
  console.log("mongodb-memory-server not found");
}

const connectDB = async () => {
  try {
    // Try connecting to the provided URI first with a short timeout
    await mongoose.connect(process.env.MONGO_URI, { 
      serverSelectionTimeoutMS: 5000 
    });
    console.log("MongoDB connected to Remote Cluster");
  } catch (error) {
    console.error("Remote MongoDB connection failed:", error.message);
    
    if (MongoMemoryServer) {
      console.log("Falling back to In-Memory MongoDB...");
      try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`MongoDB connected to In-Memory Server at ${uri}`);
        
        // Seed a demo user for convenience
        try {
          const User = require("../models/User.cjs");
          const demoUser = new User({
            name: "Demo Interviewer",
            email: "interviewer@example.com",
            password: "password",
            role: "interviewer"
          });
          await demoUser.save();
          console.log("Seeded demo user: interviewer@example.com / password");
        } catch (seedError) {
          console.log("Seeding skipped: " + seedError.message);
        }

      } catch (memError) {
        console.error("In-Memory MongoDB connection failed:", memError.message);
        console.warn("Continuing without MongoDB. Backend will run in degraded mode.");
      }
    } else {
      console.error("No fallback MongoDB available.");
      console.warn("Continuing without MongoDB. Backend will run in degraded mode.");
    }
  }
};

module.exports = connectDB;
