import mongoose from "mongoose";
import "dotenv/config"; // Make sure you have 'npm install dotenv'

const uri = process.env.MONGODB_URI;

console.log("Testing connection to:", uri?.replace(/:([^@]+)@/, ":****@")); // Hides password

async function run() {
  try {
    // 1. Try to connect
    await mongoose.connect(uri + "/resume-builder", { serverSelectionTimeoutMS: 5000 });
    console.log("✅ SUCCESS: Connection String works!");

    // 2. Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📂 Collections found in DB:", collections.map(c => c.name));

    // 3. Close connection
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ FAILURE:", err.message);
  }
}

run();