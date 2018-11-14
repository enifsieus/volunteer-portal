import React from 'react';
import { FormattedMessage } from 'react-intl';

const LOTTO_STATUS_PREREG = 'prereg';
const LOTTO_STATUS_ACTIVE = 'active';
const LOTTO_STATUS_CLOSED = 'closed';

const LotteryStatus = ({ lottery }) => {
    switch(lottery.status) {
      case LOTTO_STATUS_PREREG:
        return <FormattedMessage id="lottery.status.prereg"
                   defaultMessage="We are currently accepting registrations, but the lottery is not active. There are {waitlistSize} on the waitlist."
                   values={lottery} />
      case LOTTO_STATUS_ACTIVE:
        return <FormattedMessage id="lottery.status.active"
                   defaultMessage="The ticket lottery is active. You are number {waitlistPosition} out of {waitlistSize} on the waiting list."
                   values={lottery} />
      default:
        return <FormattedMessage id="lottery.status.closed"
                   defaultMessage="The ticket lottery is closed, and we are not accepting new registrations." />
    };
};
