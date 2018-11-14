/**
 * Waitlist Store
 *
 *
 * @author twyatt
 * @since Oct 2017
 */
import { runQuery } from '../db';
import mysql from 'mysql';
import config from 'config';


/**
 * Get waitlist status
 * @param {eventId} eventId - The id of the event
 */
export function getLotteryByEventId(eventId) {
    const query = "SELECT e.lotteryStatus AS status,count(w.user) as waistlistSize FROM events e " +
                    " LEFT JOIN waitlist w ON w.event=e.id GROUP BY w.event WHERE e.id=?";
    const params = [ eventId ];
    return runQuery(mysql.format(query, params));
}
