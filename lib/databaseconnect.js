import mongoose from "mongoose";

const mongo_uri = process.env.MONGO_URI;

if (!mongo_uri) {
  throw new Error("❌ Please define MONGO_URI in .env.local");
}

const dbConnect = async () => {
  console.log(mongo_uri)
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB");
    return mongoose.connection;
  }

  try {
    console.log("🔥 Attempting DB connection...");
    await mongoose.connect(mongo_uri,{
      serverSelectionTimeoutMS: 30000,
    });
    console.log("✅ Connected to MongoDB");
    return mongoose.connection;
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    throw err;
  }
};

export default dbConnect;
