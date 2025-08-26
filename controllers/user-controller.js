import { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  getAllUsers, 
  updateUser, 
  deleteUser,
  verifyCredentials
} from '../models/user.js';
import { generateToken } from '../utils/auth.js';

// User registration
export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation - check for empty strings and whitespace-only strings
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Check for empty strings or whitespace-only strings
    if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password cannot be empty or contain only whitespace'
      });
    }
    
    // Email format validation - more comprehensive regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Check if email already exists in database
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered'
      });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Create user
    const newUser = await createUser({ username, email, password });
    
    // Generate JWT token for the new user
    const token = generateToken(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser,
      token: token
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// User login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Verify credentials using the verifyCredentials function
    const result = await verifyCredentials(email, password);
    
    if (!result.isValid) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }
    
    // Generate JWT token for the authenticated user
    const token = generateToken(result.user);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result.user,
      token: token
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users
export function getAllUsersController(req, res) {
  try {
    const users = getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
export function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user
export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedUser = await updateUser(id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user
  export function deleteUserController(req, res) {
  try {
    const { id } = req.params;
    const result = deleteUser(id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
