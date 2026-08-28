import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const adminEmail = "admin@store.com";
const adminPassword = "admin123";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hash,
      role: "admin",
    });

    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
