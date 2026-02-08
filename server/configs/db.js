import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoDBURI = process.env.MONGODB_URI;
    const projectName = "resume-builder";

    if (!mongoDBURI) throw new Error("Mongo DB URI variable not set.");
    if (mongoDBURI.endsWith("/")) mongoDBURI = mongoDBURI.slice(0, -1);

    await mongoose.connect(`${process.env.MONGODB_URI}/${projectName}`);

    mongoose.connection.on("connected", async () => {
      console.log("DB connected successfully.");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// const connectDB = async () => {
//   try {
//     // Disable buffering globally to see real errors immediately
//     mongoose.set("bufferCommands", false);

//     const conn = await mongoose.connect(
//       `${process.env.MONGODB_URI}/resume-builder`,
//       {
//         serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//         socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//       },
//     );

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

export default connectDB;
