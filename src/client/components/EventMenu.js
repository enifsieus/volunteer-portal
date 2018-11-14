import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { concat } from '../util';

import style from './EventMenu.less';
import theme from '../theme.css';
import grid from '../grid.less';

function eventLink(eventId, link) {
  return `/event/${eventId}/${link}`;
}

const MenuItem = ({ label, link, selected }) => (
  <li className={concat(style.menuItem, selected ? style.selected : null)}>
    <Link to={link}>{label}</Link>
  </li>
);

export default ({ eventId, eventName, user, selectedTab }) => (
  console.log("EventMenu.js user: " + user) ||
  <div className={concat(style.EventMenu,
                         theme.page_padding,
                         theme.txt_lightest,
                         theme.bg_3)}>
    <div className={concat(grid.row, style.content)}>
      <nav className={concat(grid.col_sm_8, grid.off_sm_4, style.nav)}>
        <ul className={style.menu}>
          <MenuItem link={eventLink(eventId, 'overview')}
                    label={<FormattedMessage id="event.overview" defaultMessage="Event Overview" />}
                    selected={selectedTab === 'overview'}
          />
          <MenuItem link={eventLink(eventId, 'ticketing')}
                    label={<FormattedMessage id="event.ticketing" defaultMessage="Ticketing" /> }
          />
          <MenuItem link={eventLink(eventId, 'volunteers')}
                    label={<FormattedMessage id="event.volunteers" defaultMessage="Volunteers" />}
                    selected={selectedTab === 'volunteers'}
          />
        </ul>
      </nav>
    </div>
  </div>
);