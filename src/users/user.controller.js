const User = require('./user.model');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('./../middleware/tokenutils');
const jwt = require('jsonwebtoken');


// User Registration
// User Registration// Register User
// Example for Login Endpoint
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role, // Ensure role is included
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Example for Register Endpoint
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const user = new User({ username, email, password, role }); // Save role
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role, // Ensure role is included
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

  
  

// User Logout
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: 'Logged out successfully' });
};

// Fetch All Users
// Backend: Get all users with total count
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email role'); // Fetch specific fields
    const total = await User.countDocuments(); // Count total users

    res.status(200).json({
      success: true,
      total,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: 'Failed to delete user' });
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.status(200).send({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send({ message: 'Failed to update user role' });
  }
};

// Edit User Profile
exports.editProfile = async (req, res) => {
  try {
    const { userId, username, profileImage, bio, profession } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (username) user.username = username;
    if (profileImage) user.profileImage = profileImage;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;

    await user.save();

    res.status(200).send({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: 'Profile update failed', error: error.message });
  }
};
