const User = require('./user.model');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('./../middleware/tokenutils');
const jwt = require('jsonwebtoken');


// User Registration
// User Registration// Register User
exports.registerUser = async (req, res) => {
  try {
    console.log(req.body); // Log input for debugging

    const { email, password, username, name } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ message: 'Email or Username already exists' });
    }

    // Create new user
    const user = new User({ email, password, username, name });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).send({
      message: 'User registered successfully',
      token,
      user: user.toPublic(),
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ message: 'Registration failed', error: error.message });
  }
};
  
  // User Login
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT Token using tokenutils
      const token = generateToken(user._id);
  
      res.status(200).json({
        message: 'Login successful',
        token, // Send the token to the frontend
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Login failed', error: error.message });
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
