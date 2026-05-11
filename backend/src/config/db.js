const mongoose = require('mongoose');

// const connectDB = async (uri) => {
//   try {
//     const conn = await mongoose.connect(uri, {
//       // useNewUrlParser and useUnifiedTopology are defaults in modern mongoose
//     });
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Warning: MongoDB connection failed: ${error.message}`);
//     console.error('Continuing without DB connection. Some features will be disabled.');
//     // Do not exit the process so the server can start for local checks.
//   }
// };


const connectDB = async (uri) => {
  // Temporarily log to verify the URI is correct (remove after fix)
  console.log('Connecting to:', uri?.replace(/:([^:@]+)@/, ':****@')); // masks password

  try {
    const conn = await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Warning: MongoDB connection failed: ${error.message}`);
    console.error('Continuing without DB connection. Some features will be disabled.');
  }
};
module.exports = connectDB;
