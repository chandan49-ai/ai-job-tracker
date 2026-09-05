const mongoose = require("mongoose");

const connectDB = async () => {
  try {
   console.log("Mongo URI starts with:", process.env.MONGO_URI?.substring(0, 20));

const connection = await mongoose.connect(process.env.MONGO_URI, {
  family: 4,
});
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;