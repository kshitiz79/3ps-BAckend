const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('./../middleware/tokenutils');

const userController = require('./user.controller'); // Adjust the path as needed

// Register Route
router.post('/register', userController.registerUser);

// Login Route
router.post('/login', userController.loginUser);

// Logout Route
router.post('/logout', userController.logoutUser);

// Get All Users
router.get('/',  userController.getAllUsers);

// Delete User
router.delete('/users/:id', verifyToken, userController.deleteUser);

// Update User Role
router.put('/users/:id', verifyToken, userController.updateUserRole);

// Edit Profile
router.patch('/edit-profile', verifyToken, userController.editProfile);

module.exports = router;
