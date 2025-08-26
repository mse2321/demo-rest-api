// User model for authentication using SQLite database
import db from '../database/db.js';
import bcrypt from 'bcryptjs';

// Create a new user
async function createUser(userData) {
  const { username, email, password } = userData;
  
  try {
    // Check if user already exists
    const existingUser = db.prepare(
      'SELECT * FROM users WHERE email = ? OR username = ?'
    ).get(email, username);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user with hashed password
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(username, email, hashedPassword);
    
    // Get the created user (without password)
    const newUser = db.prepare(
      'SELECT id, username, email, created_at FROM users WHERE id = ?'
    ).get(result.lastInsertRowid);
    
    return newUser;
  } catch (error) {
    throw error;
  }
}

// Find user by email
function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

// Find user by username
function findUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

// Find user by ID
function findUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

// Get all users (without passwords)
function getAllUsers() {
  return db.prepare('SELECT id, username, email, created_at FROM users').all();
}

// Update user
async function updateUser(id, updateData) {
  try {
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    if (updateData.username !== undefined) {
      updateFields.push('username = ?');
      updateValues.push(updateData.username);
    }
    if (updateData.email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(updateData.email);
    }
    if (updateData.password !== undefined) {
      // Hash the password before updating
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    // Add id to the end of values array
    updateValues.push(id);
    
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(updateQuery);
    stmt.run(...updateValues);
    
    // Return updated user (without password)
    return db.prepare(
      'SELECT id, username, email, created_at FROM users WHERE id = ?'
    ).get(id);
  } catch (error) {
    throw error;
  }
}

// Delete user
function deleteUser(id) {
  try {
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Delete user
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw error;
  }
}

// Verify user credentials
async function verifyCredentials(email, password) {
    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return { isValid: false, user: null, message: 'User not found' };
    }
    
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { isValid: false, user: null, message: 'Invalid password' };
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return { 
      isValid: true, 
      user: userWithoutPassword, 
      message: 'Credentials verified successfully' 
    };
}

export { createUser, findUserByEmail, findUserByUsername, findUserById, getAllUsers, updateUser, deleteUser, verifyCredentials };