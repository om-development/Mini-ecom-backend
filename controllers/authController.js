import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SignUp controller

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

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
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Controller

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
};

// Login Controller

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

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

    const token = jwt.sign({ id: userExist._id, role: userExist.role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Sucessfull Response

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      message: "Login successfull",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Can't find the user" });
  }
};

// Get current user from cookie

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
