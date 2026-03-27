const User = require("../models/User.cjs");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user (Simple plain text password as requested)
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();
    res.status(201).json(user);

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Validate password (Simple comparison)
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Return user info (excluding password)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
