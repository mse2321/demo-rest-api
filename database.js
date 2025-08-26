import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, 'database.sqlite');

// Create database instance
const db = new Database(dbPath);

// Initialize database with tables
function initializeDatabase() {
  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      user_id INTEGER UNIQUE NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;
  
  // Create events table
  const createEventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATETIME NOT NULL,
      image TEXT,
      location TEXT NOT NULL,
      organizer_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organizer_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;
  const createRegistrationsTable = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY,
      eventId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events (id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(eventId, userId)
    )
  `;
  
  db.exec(createUsersTable);
  db.exec(createEventsTable);
  db.exec(createRegistrationsTable);
  console.log('Database initialized successfully');
}

// Initialize the database when this module is imported
initializeDatabase();

export default db;