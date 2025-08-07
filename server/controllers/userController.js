const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Replace with a secure secret in production
const JWT_SECRET = "secret123";

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: "Username already taken" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
};

exports.updateProfilePicture = async (req, res) => {
    const { profile_picture_url } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { profile_picture_url },
            { new: true }
        ).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};
