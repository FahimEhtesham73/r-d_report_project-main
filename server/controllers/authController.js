import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, nslId, email, password, userType } = req.body;
  if (!name || !nslId || !email || !password) {
    return res.status(400).send("All fields are required");
  }
  try {
    const newUser = new User({
      name,
      nslId,
      email,
      password,
      userType,
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword ,userId} = req.body;
    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(req.user);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
