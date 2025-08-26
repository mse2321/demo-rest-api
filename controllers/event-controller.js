import { 
  createEvent, 
  findEventById, 
  getAllEvents, 
  updateEvent, 
  deleteEvent,
  getEventsByOrganizer
} from '../models/event.js';

// Create a new event
export async function createEventController(req, res) {
  try {
    const { title, description, date, location, organizer_id } = req.body;
    
    // Basic validation
    if (!title || !description || !date || !location || !organizer_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: title, description, date, location, organizer_id'
      });
    }
    
    // Check for empty strings or whitespace-only strings
    if (title.trim() === '' || description.trim() === '' || location.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and location cannot be empty or contain only whitespace'
      });
    }
    
    // Create event
    const newEvent = await createEvent({ title, description, date, location, organizer_id });
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all events
export function getAllEventsController(req, res) {
  try {
    const events = getAllEvents();
    
    res.status(200).json({
      success: true,
      data: events
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get event by ID
export function getEventByIdController(req, res) {
  try {
    const { id } = req.params;
    const event = findEventById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Update event
export async function updateEventController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Basic validation for non-empty strings
    if (updateData.title !== undefined && updateData.title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty or contain only whitespace'
      });
    }
    
    if (updateData.description !== undefined && updateData.description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty or contain only whitespace'
      });
    }
    
    if (updateData.location !== undefined && updateData.location.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Location cannot be empty or contain only whitespace'
      });
    }
    
    const updatedEvent = await updateEvent(id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete event
export function deleteEventController(req, res) {
  try {
    const { id } = req.params;
    const result = deleteEvent(id);
    
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
}

// Get events by organizer
export function getEventsByOrganizerController(req, res) {
  try {
    const { organizerId } = req.params;
    const events = getEventsByOrganizer(organizerId);
    
    res.status(200).json({
      success: true,
      data: events
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
