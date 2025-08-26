// Event model for managing events using SQLite database
import db from '../database.js';

// Create a new event
async function createEvent(eventData) {
  const { title, description, date, location, organizer_id } = eventData;
  
  try {
    // Basic validation
    if (!title || !description || !date || !location || !organizer_id) {
      throw new Error('All fields are required: title, description, date, location, organizer_id');
    }
    
    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      throw new Error('Invalid date format');
    }
    
    // Check if organizer exists
    const organizer = db.prepare('SELECT id FROM users WHERE id = ?').get(organizer_id);
    if (!organizer) {
      throw new Error('Organizer not found');
    }
    
    // Insert new event
    const stmt = db.prepare(`
      INSERT INTO events (title, description, date, location, organizer_id) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, description, date, location, organizer_id);
    
    // Get the created event
    const newEvent = db.prepare(
      'SELECT * FROM events WHERE id = ?'
    ).get(result.lastInsertRowid);
    
    return newEvent;
  } catch (error) {
    throw error;
  }
}

// Find event by ID
function findEventById(id) {
  return db.prepare(`
    SELECT e.*, u.username as organizer_name 
    FROM events e 
    JOIN users u ON e.organizer_id = u.id 
    WHERE e.id = ?
  `).get(id);
}

// Get all events
function getAllEvents() {
  return db.prepare(`
    SELECT e.*, u.username as organizer_name 
    FROM events e 
    JOIN users u ON e.organizer_id = u.id 
    ORDER BY e.date ASC
  `).all();
}

// Update event
async function updateEvent(id, updateData) {
  try {
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existingEvent) {
      throw new Error('Event not found');
    }
    
    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    
    if (updateData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updateData.description);
    }
    if (updateData.date !== undefined) {
      // Validate date format
      const eventDate = new Date(updateData.date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
      }
      updateFields.push('date = ?');
      updateValues.push(updateData.date);
    }
    if (updateData.location !== undefined) {
      updateFields.push('location = ?');
      updateValues.push(updateData.location);
    }
    if (updateData.organizer_id !== undefined) {
      // Check if new organizer exists
      const organizer = db.prepare('SELECT id FROM users WHERE id = ?').get(updateData.organizer_id);
      if (!organizer) {
        throw new Error('Organizer not found');
      }
      updateFields.push('organizer_id = ?');
      updateValues.push(updateData.organizer_id);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    // Add id to the end of values array
    updateValues.push(id);
    
    const updateQuery = `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(updateQuery);
    stmt.run(...updateValues);
    
    // Return updated event
    return findEventById(id);
  } catch (error) {
    throw error;
  }
}

// Delete event
function deleteEvent(id) {
  try {
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!existingEvent) {
      throw new Error('Event not found');
    }
    
    // Delete event
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(id);
    
    return { message: 'Event deleted successfully' };
  } catch (error) {
    throw error;
  }
}

// Get events by organizer
function getEventsByOrganizer(organizerId) {
  return db.prepare(`
    SELECT e.*, u.username as organizer_name 
    FROM events e 
    JOIN users u ON e.organizer_id = u.id 
    WHERE e.organizer_id = ? 
    ORDER BY e.date ASC
  `).all(organizerId);
}

export { 
  createEvent, 
  findEventById, 
  getAllEvents, 
  updateEvent, 
  deleteEvent, 
  getEventsByOrganizer 
};
