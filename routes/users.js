import express from 'express';
import { 
  signup, 
  login, 
  getAllUsersController, 
  getUserById, 
  updateUserController, 
  deleteUserController 
} from '../controllers/user-controller.js';

const router = express.Router();

// User registration route
router.post('/signup', signup);

// User login route
router.post('/login', login);

// Get all users (for testing purposes)
router.get('/', getAllUsersController);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUserController);

// Delete user
router.delete('/:id', deleteUserController);

export default router;
