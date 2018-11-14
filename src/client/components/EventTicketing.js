import React from 'react';
import { FormattedMessage } from 'react-intl';
import { concat } from '../util';
import Image from './Image';
import Content from './Content';
import Button from './Button';
import BigDate from './BigDate';
import BigNumber from './BigNumber';
import UserBadge from './UserBadge';
import Address from './Address';
import PageTitle from './PageTitle';
import EventDepartmentsList from './EventDepartmentsList';
import TicketStatus from './TicketStatus';
import { RegistrationForm } from './TicketRegistration';
import DataLoader from '../containers/DataLoader';

import grid from '../grid.less';
import theme from '../theme.css';
import style from './EventOverview.less';

const DESCRIPTION_LENGTH = 250;

const Description = ({ text }) => {
  const display = text.length <= DESCRIPTION_LENGTH ?
      text :
      text.substring(0, DESCRIPTION_LENGTH)
          .split(' ')
          .slice(0, -1)
          .join(' ');
  return (
    <span className={style.description}>
      {display}
      {display.length < text.length ? (
          <span className={style.more}>
            <FormattedMessage id="event.seeMore" defaultMessage="See More..." />
          </span>)
          : null
      }
    </span>
  );
};

const EventRow = ({ event, lead, user }) => {
  return (
  <div className={grid.row}>
    <section className={grid.col_sm_4} style={{position: 'relative'}}>
      <PageTitle className={theme.txt_lightest} title={event.name} />
      <Image className={style.eventPhoto} url={event.photo} ratio={1}>
        <UserBadge title={<FormattedMessage id="event.lead" defaultMessage="Event Lead" />}
                   name={lead.name}
                   avatar={lead.avatar}
                   theme="light"
                   justify="left"
                   className={style.eventLead} />
      </Image>
    </section>
    <section className={grid.col_sm_8}>
      <Info event={event} user={user} />
    </section>
  </div>
)};

const Info = ({ event, user }) => (
  console.log("Info: event: " + JSON.stringify(event) + " user: " + JSON.stringify(user)) ||
  <div className={concat(style.info, theme.bg_content)}>
    <div className={concat(style.numberSection, theme.divider)}>
      <div>
        <BigDate
            date={event.startDate}
            label={<FormattedMessage id="date.start" defaultMessage="Start" />}
            className={theme.txt_accent}
        />
        <BigDate
            date={event.endDate}
            label={<FormattedMessage id="date.end" defaultMessage="End" />}
            className={concat(theme.txt_accent, style.topMargin)}
        />
      </div>
    </div>
    <div className={concat(style.registrationSection, theme.divider)}>
      <h3 className={theme.title}>
        <FormattedMessage id="event.ticketing.title" defaultMessage="Ticketing" />
      </h3>
      <div>
        <DataLoader serviceCall={{
                      [`events/${event.id}`]:     'event',
                      [`users/${user.id}/ticket/${event.id}`]: 'ticket' }}
                    component={TicketStatus} />
      </div>
    </div>
  </div>
);

export default ({ eventId, user }) => (
  console.log("EventTicketing user " + user) ||
  <div className={concat(style.wrap, theme.page_padding)}>
    <section className={style.event}>
      <DataLoader serviceCall={{
                    [`events/${eventId}`]: 'event',
                    [`events/${eventId}/lead`]: 'lead',
                    [`users/${user.id}`]: 'user'}}
                  component={EventRow} />
    </section>
    <section className={style.form}>
      <FormattedMessage id="event.ticketing.registrationInstructions"
          defaultMessage="All tickets to this event are will-call, and you will need to present a government-issued photo ID at the gate. We need your name as it appears on the ID that you will present. If that's different the name that you registered your account with, please update it below so that we have the right information for your ticket." />
      <div className={style.form}>
      <RegistrationForm />
      </div>
    </section>
  </div>
)
