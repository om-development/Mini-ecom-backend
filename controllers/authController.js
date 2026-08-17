import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SignUp controller

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

// Login Controller

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First Checking If The User Exists Or Not

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    // Now Checking If The Password Is Correct

    const check = await bcrypt.compare(password, userExist.password);

    if (!check) {
      return res.status(400).json({ message: "Invalid Credidentials" });
    }

    // Assigning Jwt token

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Sucessfull Response

    res.json({
      message: "Login successfull",
      token,
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Can't find the user" });
  }
};
