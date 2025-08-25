# Demo REST API with SQLite

A simple REST API built with Express.js and SQLite database using `better-sqlite3`.

## Features

- User authentication (signup/login)
- CRUD operations for users
- SQLite database for persistent data storage
- RESTful API endpoints

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   npm run init-db
   ```
   This will create the database file and add sample users.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - API information
- `POST /users/signup` - Create a new user
- `POST /users/login` - User login
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Database

The application uses SQLite with `better-sqlite3` for data persistence. The database file is stored in the `data/` directory.

### Database Schema

**Users Table:**
- `id` - Primary key (auto-increment)
- `username` - Unique username
- `email` - Unique email address
- `password` - User password (plain text for demo)
- `created_at` - Timestamp of user creation

## Project Structure

```
demo-rest-api/
├── app.js                 # Main application file
├── database/
│   └── db.js             # Database configuration
├── models/
│   └── user.js           # User model with database operations
├── routes/
│   └── users.js          # User routes
├── scripts/
│   └── init-db.js        # Database initialization script
├── data/
│   └── app.db            # SQLite database file (created automatically)
└── package.json
```

## Development

The application automatically creates the database and tables when it starts. The database file (`data/app.db`) is excluded from version control via `.gitignore`.

## Notes

- Passwords are stored as plain text for demonstration purposes. In a production environment, use proper password hashing (e.g., bcrypt).
- The database file is created automatically when the application starts.
- Sample users are added during database initialization for testing.
