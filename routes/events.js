import express from 'express';
import { 
  createEventController, 
  getAllEventsController, 
  getEventByIdController, 
  updateEventController, 
  deleteEventController,
  getEventsByOrganizerController
} from '../controllers/event-controller.js';

const router = express.Router();

// Create a new event
router.post('/', createEventController);

// Get all events
router.get('/', getAllEventsController);

// Get events by organizer
router.get('/organizer/:organizerId', getEventsByOrganizerController);

// Get event by ID
router.get('/:id', getEventByIdController);

// Update event by ID
router.put('/:id', updateEventController);

// Delete event by ID
router.delete('/:id', deleteEventController);

export default router;
