const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function for handling errors
const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({
    success: false,
    message: `Error during ${context}`,
    error: error.message
  });
};

// Register User
const register = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);

    const { name, email, password, country } = req.body;

    if (!name || !email || !password || !country) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Saving user to database...");
    const user = new User({ name, email, password: hashedPassword, country });

    await user.save().catch(error => {
      console.error("❌ MongoDB Write Error:", error);
      throw new Error("Error saving user to MongoDB");
    });

    console.log("✅ User saved successfully:", user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" });

    return res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "7d",
    });

    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Get Logged-in User Info
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Token Verification Route (Used in PrivateRoute.jsx)
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ isValid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    return res.json({ isValid: !!decoded });
  } catch (error) {
    console.error("❌ Token Verification Error:", error);
    return res.json({ isValid: false });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyToken // ✅ Added this to verify authentication in PrivateRoute.jsx
};
