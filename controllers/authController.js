import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailSender.js";
import { otpTemplate } from "../utils/emailTemplates.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, nic, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      nic,
      role: role || "consumer",
      isVerified: false,
    });

    // Create verification token
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate as string

    // Send verification email
    await sendEmail(
      user.email,
      "Your Verification OTP",
      `Your OTP is: ${otp}`,
      otpTemplate(otp)
    );

    // Store OTP in user document
    user.verificationOTP = otp;
    user.otpExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase().trim();

    console.log("Login attempt for:", email); // Add logging
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Add admin-specific check
    if (user.role === "admin" && !user.isVerified) {
      user.isVerified = true; // Auto-verify admin if not verified
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Stored password hash:", user.password);
      console.log(
        "Input password comparison:",
        await bcrypt.compare(password, user.password)
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Skip email verification check for admin
    if (!user.isVerified && user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyIdentity = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Remove user verification from token
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiration
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerOutletManager = async (req, res) => {
  try {
    const { name, email, password, phone, nic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      nic,
      role: "outlet_manager",
      isVerified: true, // Auto-verify manager accounts
    });

    res.status(201).json({
      message: "Outlet manager registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone role")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
