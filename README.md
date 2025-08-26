# Demo REST API with SQLite

A simple REST API built with Express.js and SQLite database using `better-sqlite3`.

## Features

- User authentication (signup/login)
- CRUD operations for users
- CRUD operations for events
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

### User Endpoints
- `GET /` - API information
- `POST /users/signup` - Create a new user
- `POST /users/login` - User login
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Event Endpoints
- `POST /events` - Create a new event
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `PUT /events/:id` - Update event by ID
- `DELETE /events/:id` - Delete event by ID
- `GET /events/organizer/:organizerId` - Get events by organizer

## Database

The application uses SQLite with `better-sqlite3` for data persistence. The database file is stored in the `data/` directory.

### Database Schema

**Users Table:**
- `id` - Primary key (auto-increment)
- `username` - Unique username
- `email` - Unique email address
- `password` - User password (hashed with bcrypt)
- `created_at` - Timestamp of user creation

**Events Table:**
- `id` - Primary key (auto-increment)
- `title` - Event title
- `description` - Event description
- `date` - Event date and time
- `location` - Event location
- `organizer_id` - Foreign key to users table
- `created_at` - Timestamp of event creation

## Project Structure

```
demo-rest-api/
├── app.js                 # Main application file
├── database.js            # Database configuration
├── models/
│   ├── user.js           # User model with database operations
│   └── event.js          # Event model with database operations
├── controllers/
│   ├── user-controller.js # User controller functions
│   └── event-controller.js # Event controller functions
├── routes/
│   ├── users.js          # User routes
│   └── events.js         # Event routes
├── scripts/
│   └── init-db.js        # Database initialization script
├── database.sqlite       # SQLite database file (created automatically)
└── package.json
```

## Development

The application automatically creates the database and tables when it starts. The database file (`database.sqlite`) is excluded from version control via `.gitignore`.

## Testing

You can test the event endpoints using the provided test script:

```bash
node test-events.js
```

This will test all CRUD operations for events.

## Notes

- Passwords are hashed using bcrypt for security.
- The database file is created automatically when the application starts.
- Events require a valid organizer_id (user ID) to be created.
- All event operations include proper validation and error handling.
