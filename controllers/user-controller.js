import { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  getAllUsers, 
  updateUser, 
  deleteUser 
} from '../models/user.js';

// User registration
export function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Create user
    const newUser = createUser({ username, email, password });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// User login
export function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password (in a real app, this would compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword
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
export function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove password from update data for security
    delete updateData.password;
    
    const updatedUser = updateUser(id, updateData);
    
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
