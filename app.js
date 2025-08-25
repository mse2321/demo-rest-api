import express from 'express';
import userRoutes from './routes/users.js';
import db from './database.js';
import { initializeDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API',
    endpoints: {
      users: '/users',
      signup: '/users/signup',
      login: '/users/login'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
  try {
    initializeDatabase();
    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    db.close();
  }
});