import React from 'react';
import { Redirect } from 'react-router-dom';
import EventMenu from './EventMenu';
import EventOverview from './EventOverview';
import EventDepartments from './EventDepartments';
import EventTicketing from './EventTicketing';
import EventVolunteers from './Todo';
import EventSchedule from './Todo';

import style from './Event.less';

function eventTab(selectedTab, eventId, user) {
  console.log("eventTab user: " + user);
  switch (selectedTab) {
    case 'overview':
      return <EventOverview eventId={eventId} />;
    case 'ticketing':
      return <EventTicketing eventId={eventId} user={user} />;
    case 'teams':
      return <EventDepartments eventId={eventId}/>;
    case 'volunteers':
      return <EventVolunteers />;
    case 'schedule':
      return <EventSchedule />;
    default:
      return <Redirect to={`/event/${eventId}/overview`} />
  }
}

export default ({ match, user }) => (
  console.log("Event with user " + user) ||
  <div className={style.Event}>
    <EventMenu eventId={match.params.id} user={user} selectedTab={match.params.selectedTab} />
    {eventTab(match.params.selectedTab, match.params.id, user)}
  </div>
);