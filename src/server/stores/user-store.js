/**
 * User Store
 *
 * TODO: Make it real.
 *
 * @author mtownsend
 * @since Oct 2017
 */
import bcrypt from 'bcrypt-nodejs';
import { runQuery } from '../db';
import mysql from 'mysql';
import config from 'config';

const emailToId = {
  'butts@butts.com': 0
};

const fakeStore = {
  0: {
    id: 0,
    lastName: 'McPinchface',
    firstName: 'Pinchy',
    burnName: '',
    avatar: 'pinchy.jpg',
    email: 'butts@butts.com',
    password: hash('buttsRgr8')
  }
};

function hash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validate(password, user) {
  return bcrypt.compareSync(password, user.password);
}

function runUserQuery(query) {
  return runQuery(query)
    .then(rows => {
        if (rows.length == 0) {
          return null;
        }

        // Copy from SQL RowDataPacket to generic object
        const user = Object.assign({}, rows[0]);
        user.password = String.fromCharCode(...user.password);

        return user;
    });
}

/**
 * Gets a user by id
 * @param {number} id - The id of the user
 * @returns {Promise.<object|null>} Promise resolving to the user, or null if one cannot be found
 */
export function getById(id) {
  if (config.db.isMocked) {
    return fakeStore[id] || null;
  }
  
  const query = "SELECT id, CONCAT(firstName,' ',lastName) AS name, photo AS avatar, email, password " +
                "FROM users WHERE id=?";
  const params = [id];
  return runUserQuery(mysql.format(query, params));
}

/**
 * Looks a user up by email.
 * @param {string} email - User's email address
 * @returns {Promise.<object|null>} Promise resolving to the user, or null if one cannot be found
 */
export function getByEmail(email) {
    if(config.db.isMocked){
        if (!emailToId.hasOwnProperty(email)) {
            return Promise.resolve(null);
        }
        return Object.assign({}, fakeStore[emailToId[email]]);
    }

    const query = "SELECT id, CONCAT(firstName,' ',lastName) AS name, photo AS avatar, dateOfBirth, email, password  from users WHERE email=?";

    return runUserQuery(mysql.format(query, [email]));
}

/**
 * Create a new user
 * @param {string} user - User information
 * @returns {Promise.<object>} Promise resolving to the user, or indicating failure
 */
export function createUser(user) {
    const params = [ user.firstName, user.lastName, user.burnName, user.email, user.dateOfBirth, hash(user.password) ];
    const query = "INSERT INTO users(firstName, lastName, burnName, email, dateOfBirth, password) VALUES(?, ?, ?, ?, ?, ?)"
    return runQuery(mysql.format(query, params));
}

/**
 * Register a user for an event
 * @param {number} eventId - The id of the event being registered for
 * @param {number} userId - The user registering for the event
 * @param {string} legalFirstName - The user's legal first name
 * @param {string} legalLastname - The user's legal last name
 * @returns {Promis<object|null>} Promise resolving to the ticket status
 */
export function registerUser(eventId, userId, legalFirstName, legalLastName) {
    const params = [ eventId, userId, legalFirstName, legalLastName ];
    const query = "INSERT INTO ticketStatus(event, user, legalFirstName, legalLastName, registeredAt) " +
                    " VALUES (?, ?, ?, ?, NOW())";
    runQuery(mysql.format(query, params)).then(result => {
        return getTicketStatus(eventId, userId);
    });
}

/**
  * Get registration for an event
  * @param {number} eventId - The id of the event
  * @param {number} userId - The id of the user
  * @returns {Promis<object|null>} Promise resolving to the ticket status
  */
 export function getTicketStatus(eventId, userId) {
     const params = [ eventId, userId ];
     const query = "SELECT t.status AS status, t.event AS eventId, t.firstName, t.lastName, " +
                          "t.lastUpdate, o.offerType, o.expires AS offerExpires, " +
                          "o.note AS offerNote, o.status AS offerStatus " +
                     "FROM tickets t " +
                     "LEFT JOIN ticketOffers o ON o.user=t.user AND o.event=t.event " +
                     "WHERE t.event=? and t.user=?";
     console.log(query + " -- " + JSON.stringify(params));
     return runQuery(mysql.format(query, params));
 }

/**
 * Gets a user from the store, validating their password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise.<object|null>} Promise resolving to the user, or null if one cannot be found
 */
export function authenticate(email, password) {
  return getByEmail(email).then(user => {
    if (!user || !validate(password, user)) {
      return null;
    }
    return user;
  });
}
