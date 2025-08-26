import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testEvents() {
  console.log('🧪 Testing Event Routes...\n');

  try {
    // Test 1: Create a user first (required for organizer_id)
    console.log('1. Creating a test user...');
    const userResponse = await fetch(`${BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testorganizer',
        email: 'organizer@test.com',
        password: 'password123'
      })
    });
    
    const userData = await userResponse.json();
    console.log('User created:', userData.success ? '✅' : '❌');
    
    if (!userData.success) {
      console.log('Error:', userData.message);
      return;
    }
    
    const organizerId = userData.data.id;
    console.log(`Organizer ID: ${organizerId}\n`);

    // Test 2: Create an event
    console.log('2. Creating an event...');
    const createEventResponse = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Event',
        description: 'This is a test event for demonstration',
        date: '2024-12-25T18:00:00',
        location: 'Test Location',
        organizer_id: organizerId
      })
    });
    
    const eventData = await createEventResponse.json();
    console.log('Event created:', eventData.success ? '✅' : '❌');
    
    if (!eventData.success) {
      console.log('Error:', eventData.message);
      return;
    }
    
    const eventId = eventData.data.id;
    console.log(`Event ID: ${eventId}\n`);

    // Test 3: Get all events
    console.log('3. Getting all events...');
    const getAllEventsResponse = await fetch(`${BASE_URL}/events`);
    const allEventsData = await getAllEventsResponse.json();
    console.log('All events retrieved:', allEventsData.success ? '✅' : '❌');
    console.log(`Number of events: ${allEventsData.data.length}\n`);

    // Test 4: Get event by ID
    console.log('4. Getting event by ID...');
    const getEventResponse = await fetch(`${BASE_URL}/events/${eventId}`);
    const singleEventData = await getEventResponse.json();
    console.log('Event retrieved:', singleEventData.success ? '✅' : '❌');
    console.log(`Event title: ${singleEventData.data.title}\n`);

    // Test 5: Update event
    console.log('5. Updating event...');
    const updateEventResponse = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Updated Test Event',
        description: 'This event has been updated'
      })
    });
    
    const updatedEventData = await updateEventResponse.json();
    console.log('Event updated:', updatedEventData.success ? '✅' : '❌');
    console.log(`Updated title: ${updatedEventData.data.title}\n`);

    // Test 6: Get events by organizer
    console.log('6. Getting events by organizer...');
    const organizerEventsResponse = await fetch(`${BASE_URL}/events/organizer/${organizerId}`);
    const organizerEventsData = await organizerEventsResponse.json();
    console.log('Organizer events retrieved:', organizerEventsData.success ? '✅' : '❌');
    console.log(`Number of events by organizer: ${organizerEventsData.data.length}\n`);

    // Test 7: Delete event
    console.log('7. Deleting event...');
    const deleteEventResponse = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'DELETE'
    });
    
    const deleteEventData = await deleteEventResponse.json();
    console.log('Event deleted:', deleteEventData.success ? '✅' : '❌');
    console.log(`Message: ${deleteEventData.message}\n`);

    // Test 8: Verify event is deleted
    console.log('8. Verifying event is deleted...');
    const verifyDeleteResponse = await fetch(`${BASE_URL}/events/${eventId}`);
    const verifyDeleteData = await verifyDeleteResponse.json();
    console.log('Event not found (as expected):', !verifyDeleteData.success ? '✅' : '❌');
    console.log(`Message: ${verifyDeleteData.message}\n`);

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEvents();
