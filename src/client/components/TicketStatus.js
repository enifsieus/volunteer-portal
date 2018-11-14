import React from 'react';
import { FormattedMessage } from 'react-intl';

const TICKET_STATUS_NONE     = 'none';
const TICKET_STATUS_WAITLIST = 'waitlist';
const TICKET_STATUS_OFFERED  = 'offered';
const TICKET_STATUS_TICKETED = 'ticketed';
const TICKET_STATUS_REFUSED  = 'refused';
const TICKET_STATUS_LAPSED   = 'lapsed';
const TICKET_STATUS_REFUNDED = 'refunded';
const TICKET_STATUS_ONHOLD   = 'onhold';

const LOTTO_STATUS_PREREG = 'prereg';
const LOTTO_STATUS_ACTIVE = 'active';
//const LOTTO_STATUS_CLOSED = 'closed';

const NotRegistered = ({ ticket, lottery }) => {
    switch (lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="ticket.status.none.prereg"
                   defaultMessage="You are not yet registered for the event. There are {lottery.waitlisted} participants registered, and the lottery has not yet started."
                   values={{ticket, lottery}} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="ticket.status.none.active"
                   defaultMessage="The lottery is active, but you have not yet registered for the event. There are currently {lottery.waitlisted} on the waitlist."
                   values={{ticket, lottery}} />
      default:
        return <FormattedMessage id="ticket.status.none.closed"
                   defaultMessage="You are not registered for this event, and it is not accepting registrations at this time."
                   values={{ticket, lottery}} />
    }
}

const WaitlistStatus = ({ ticket, lottery }) => {
    switch (lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="ticket.status.waitlist.prereg"
                   defaultMessage="You are registered for the waiting list with {lottery.waitlisted} participants, but the lottery has not yet started."
                   values={{ticket, lottery}} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="ticket.status.waitlist.active"
                   defaultMessage="The lottery is active, and you are {ticket.lotteryPosition} out of {lottery.waitlisted} on the waitlist."
                   values={{ticket, lottery}} />
      default:
        throw new Error("WaitlistStatus is not valid if the lottery is closed.");
    }
};

const OfferedStatus = ({ ticket, lottery }) => (
  <span>
    <FormattedMessage id="ticket.status.offered"
        defaultMessage="You have an active ticket offer that is valid until {ticket.offer.expirationDate}."
        values={{ticket, lottery}} />
    &nbsp;
    <FormattedMessage id="ticket.status.offered.releaseOption"
        defaultMessage="If you do not want to purchase your ticket, you can release it. You will have the option to re-join the waiting list later if you'd like, which currently has {lottery.waitlisted} waiting for tickets."
        values={{ticket, lottery}} />
  </span>
);

const TicketedStatus = ({ ticket, lottery }) => {
    return <FormattedMessage id="ticket.status.ticketed.prereg"
               defaultMessage="Congratulations, you are ticketed for the event!"
               values={{ticket, lottery}} />
};

const RefusedStatus = ({ ticket, lottery }) => {
    switch (lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="ticket.status.refused.prereg"
                   defaultMessage="You previously had a ticket offer, but refused it. The lottery has not yet started, and you can rejoin the waiting list if you'd like, which currently has {lottery.waitlisted} waiting for tickets."
                   values={{ticket, lottery}} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="ticket.status.refused.active"
                   defaultMessage="You previously had a ticket offer, but refused it. The lottery is active, and you can rejoin it. There are currently {lottery.waitlisted} on the waiting list."
                   values={{ticket, lottery}} />
      default:
        throw new Error("RefusedStatus is not valid if the lottery is closed.");
    }
};

const LapsedStatus = ({ ticket, lottery }) => {
    switch (lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="ticket.status.lapsed.prereg"
                   defaultMessage="You previously had a ticket offer, but it lapsed on {ticket.offer.expirationDate}. The lottery has not yet started, and you can rejoin the waiting list if you'd like, which currently has {lottery.waitlisted} waiting for tickets."
                   values={{ticket, lottery}} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="ticket.status.lapsed.active"
                   defaultMessage="You previously had a ticket offer, but it lapsed on {ticket.offer.expirationDate}. The lottery is active, and you can rejoin it. There are currently {lottery.waitlisted} on the waiting list."
                   values={{ticket, lottery}} />
      default:
        throw new Error("LapsedStatus is not valid if the lottery is closed.");
    }
};

const RefundedStatus = ({ ticket, lottery }) => {
    switch (lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="ticket.status.refunded.prereg"
                   defaultMessage="You previously had a ticket offer, but you refunded it on {ticket.lastUpdate}. The lottery has not yet started, and you can rejoin the waiting list if you'd like, which currently has {lottery.waitlisted} waiting for tickets."
                   values={{ticket, lottery}} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="ticket.status.refunded.active"
                   defaultMessage="You previously had a ticket offer, but you refunded it on {ticket.lastUpdate}. The lottery is active, and you can rejoin it. There are currently {lottery.waitlisted} on the waiting list."
                   values={{ticket, lottery}} />
      default:
        throw new Error("Refunded is not valid if the lottery is closed.");
    }
};

const HoldStatus = ({ ticket, lottery }) => (
    <FormattedMessage id="ticket.status.onhold"
        defaultMessage="You event registration has been placed on hold." />
);

export default ({ ticket, event }) => {
    var status = ticket != null ? ticket.status : TICKET_STATUS_NONE;
    switch (status) {
      case TICKET_STATUS_NONE:
        return <NotRegistered ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_WAITLIST:
        return <WaitlistStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_OFFERED:
        return <OfferedStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_TICKETED:
        return <TicketedStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_REFUSED:
        return <RefusedStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_LAPSED:
        return <LapsedStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_REFUNDED:
        return <RefundedStatus ticket={ticket} lottery={event.lottery} />
      case TICKET_STATUS_ONHOLD:
        return <HoldStatus ticket={ticket} lottery={event.lottery} />
      default:
        throw new Error("Unknown ticket status " + ticket.status);
    }
};
