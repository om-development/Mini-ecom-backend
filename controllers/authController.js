import User from "../models/User.js";
import bcrypt from "bcrypt";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // First Checking If The User Exists Or Not

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    // Hashing the Password here

    const hashPassword = await bcrypt.hash(password, 10);

    // Now Creating User

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.json({ message: "User Created sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export default signupUser;
