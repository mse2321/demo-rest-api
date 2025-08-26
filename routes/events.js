import express from 'express';
import { 
  createEventController, 
  getAllEventsController, 
  getEventByIdController, 
  updateEventController, 
  deleteEventController,
  getEventsByOrganizerController,
  registerUserForEventController,
  unregisterUserFromEventController
} from '../controllers/event-controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Create a new event
router.post('/', authenticate, upload.single('image'), createEventController);

// Get all events
router.get('/', getAllEventsController);

// Get events by organizer
router.get('/organizer/:organizerId', getEventsByOrganizerController);

// Get event by ID
router.get('/:id', getEventByIdController);

// Update event by ID
router.put('/:id', authenticate, upload.single('image'), updateEventController);

// Delete event by ID
router.delete('/:id', authenticate, deleteEventController);

router.post('/:id/register', authenticate, registerUserForEventController);

router.post('/:id/unregister', authenticate, unregisterUserFromEventController);

export default router;
