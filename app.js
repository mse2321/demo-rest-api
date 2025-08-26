import express from 'express';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import db from './database.js';
import cors from 'cors';

// Database initialization callback
async function initializeDatabase() {
  try {
    await db.sync(); // or db.authenticate() depending on your ORM
    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); //set CORS headers for UI
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public directory

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API',
    endpoints: {
      users: '/users',
      signup: '/users/signup',
      login: '/users/login',
      events: '/events'
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

// Start server after DB initialization
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});