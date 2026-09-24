const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error connecting mongodb: ${error.message}`);
    process.exit(1); //exit process with failure
  }
};

module.exports = connectDB;
