function addProfessionalEmailToPersonalEvents(event) {

  if (event != null) Logger.log(`addProfessionalEmailToPersonalEvents(authMode: [${event.authMode}], calendarId: [${event.calendarId}], triggerUid: [${event.triggerUid}])`)

  //Define consts
  const calendarName = "CalendarName";
  const attendeeEmail = "attendee@email.com";

  //Get calendar
  Logger.log(`getCalendar(calendarName: [${calendarName}])`)

  //Get calendar by name
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0]

  //Check if calendar exists
  if (calendar === null) {
    // Calendar not found
    throw new Error(`Calendar not found [${calendarId}]`);
  }

  Logger.log(`getLastEventCreated(calendar.id: [${calendar.getId()}], calendar.title: [${calendar.getTitle()}])`)
 
  //Get last updated event
  //https://stackoverflow.com/questions/74249764/google-calendar-api-v3-get-id-of-last-modified-event
    const yesterday = () => {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      return d;
    };

    options = {
      updatedMin: yesterday().toISOString(),
      maxResults: 100,
      orderBy: 'updated',
      singleEvents: true,
      showDeleted: false
    }

  //Get list of events last updated  
  var eventList = Calendar.Events.list(calendar.getId(), options);

  //Check if events were obtained
  if (eventList === null || eventList.items.length == 0) {
    // No events not found
    throw new Error("No events found");
  }

  //I'm lazy and I didn't want to implement the pagination logic. So, I'll get one big page and get the last event in that list,
  // which is the most recent
  var event = eventList.items.pop()

  Logger.log(`Last event is [${event.id}][${event.summary}]`)

  //Get event attendees
  var eventAttendees = event.getAttendees();

  //Check if attendee is already there
  if (eventAttendees && eventAttendees.some(item => item.email === attendeeEmail)) {
    Logger.log ("Attendee is already added to event.");
  }
  else {

    //Get event id to handle the recurrent events
    var eventId = event.recurringEventId || event.id

    Logger.log(`addAttendeeToEvent(event.id: [${calendar.getId()}], event.id: [${eventId}], attendeeEmail: [${attendeeEmail}])`)

    //For some weird reason I need to get the event using this function to be able to use the addGuest function :shrug:
    event = calendar.getEventById(eventId);
    
    //Add attendee to event
    event.addGuest(attendeeEmail)
  }
}
