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
    const image = req.file; // Access the uploaded file

    // Basic validation for required fields
    if (!title || !description || !date || !location || !organizer_id || !image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: title, description, date, location, organizer_id, image'
      });
    }

    // Check for empty strings or whitespace-only strings
    if (
      typeof title !== 'string' || title.trim() === '' ||
      typeof description !== 'string' || description.trim() === '' ||
      typeof location !== 'string' || location.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and location cannot be empty or contain only whitespace'
      });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (
      typeof date !== 'string' ||
      date.trim() === '' ||
      isNaN(parsedDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Date must be a valid date string'
      });
    }

    // Create event
    const newEvent = await createEvent({ title, description, date, location, organizer_id, image: image.filename, user_id: req.user.id });

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

    // Find the event to check ownership
    const event = await findEventById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if the user is the owner of the event
    if (!req.user || event.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }

    // Validate that at least one field is provided
    if (
      !updateData.title &&
      !updateData.description &&
      !updateData.date &&
      !updateData.location &&
      !updateData.organizer_id &&
      !updateData.req.file
    ) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (title, description, date, location, organizer_id) must be provided for update'
      });
    }

    // Basic validation for non-empty strings
    if (updateData.title !== undefined && (typeof updateData.title !== 'string' || updateData.title.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty or contain only whitespace'
      });
    }

    if (updateData.description !== undefined && (typeof updateData.description !== 'string' || updateData.description.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty or contain only whitespace'
      });
    }

    if (updateData.location !== undefined && (typeof updateData.location !== 'string' || updateData.location.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Location cannot be empty or contain only whitespace'
      });
    }

    // Validate date if provided
    if (updateData.date !== undefined) {
      if (
        typeof updateData.date !== 'string' ||
        updateData.date.trim() === '' ||
        isNaN(new Date(updateData.date).getTime())
      ) {
        return res.status(400).json({
          success: false,
          message: 'Date must be a valid date string'
        });
      }
    }

    // Validate organizer_id if provided
    if (updateData.organizer_id !== undefined && (typeof updateData.organizer_id !== 'string' || updateData.organizer_id.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Organizer ID cannot be empty or contain only whitespace'
      });
    }

    if (req.file) {
      if (typeof req.file.path !== 'string' || req.file.path.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Image path is invalid'
      });
      }
      updateData.image = req.file;
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
export async function deleteEventController(req, res) {
  try {
    const { id } = req.params;

    // Find the event to check ownership
    const event = await findEventById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if the user is the owner of the event
    if (!req.user || event.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }

    const result = await deleteEvent(id);

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

export async function registerUserForEventController(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user && req.user.id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Register the user for the event using the model function
    const registrationResult = await registerUserForEvent(eventId, userId);

    if (registrationResult.success === false) {
      return res.status(400).json({
        success: false,
        message: registrationResult.message || 'Registration failed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User registered for event successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function unregisterUserFromEventController(req, res) {
  try {
    const { eventId } = req.params;
    const userId = req.user && req.user.id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Unregister the user for the event using the model function
    const unregistrationResult = await unregisterUserFromEvent(eventId, userId);

    if (unregistrationResult.success === false) {
      return res.status(400).json({
        success: false,
        message: unregistrationResult.message || 'Unregistration failed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unregistered from event successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
