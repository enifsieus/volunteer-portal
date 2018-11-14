/**
 * Routes for api calls. If this gets too big, split it into
 * separate files under an api/ directory.
 *
 * @author mtownsend
 * @since Oct 2017
 **/
import express from 'express';
import passport from 'passport';
import config from 'config';

import { isLoggedIn } from './auth';
import { getById as getEvent } from './stores/event-store';
import { getAll as getDepartments } from './stores/department-store';
import { getById as getUserById } from './stores/user-store';
import { getByEmail as getUserByEmail } from './stores/user-store';
import { createUser, getTicketStatus } from './stores/user-store';
import fetch from 'isomorphic-fetch';

import { body, check, validationResult } from 'express-validator/check';

const HOST = 'localhost';

const router = express.Router();

function scrubUser(user) {
  const scrubbedUser = Object.assign({}, user);
  delete scrubbedUser.password;
  return scrubbedUser;
}

const POSTS = [
  ['/login', (request, response) => {
    passport.authenticate('local-login', function (err, token, user) {
      if (err || !token) {
        return response.status(401).json({
          success: false,
          message: err && err.message
        });
      }
      return response.json({
        success: true,
        token,
        user: scrubUser(user)
      });
    })(request, response);
  }],

  /* Register a new user */
  ['/signup', [
     body('signup.firstName', 'First name is required').exists(),
     body('signup.lastName', 'Last name is required').exists(),
     body('signup.email', 'Email is required').exists(),
     body('signup.email', 'Invalid email').isEmail(),
     body('signup.email').custom(value => {
        return getUserByEmail(value).then(user => {
            if (user)
                return Promise.reject("This email is already registered");
        })
     }),
     body('signup.dateOfBirth', 'Date of birth is required').exists(),
     body('signup.dateOfBirth', 'Date must be YYYY-MM-DD').isISO8601(),
     body('signup.password', 'Password is required').exists(),
     body('signup.password', 'Password must be at least 8 characters').isLength({ min: 8 }),
     body('signup.repeatpassword', 'Confirmation password is required').exists(),
     body('signup.repeatpassword', 'Repeat password does not match password').custom((value, { req }) => {
        if (value !== req.body.signup.password)
            throw new Error("Passwords do not match");
        return value;
     })
  ], (request, response) => {
     const errors = validationResult(request);
     if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
     }

     const { signup } = request.body;

     return createUser(signup).then(result => {
        return response.status(200).json({});
     }).catch(error => {
        console.log("[signup] " + JSON.stringify(error));
        return response.status(500).json({ reason: "Registration could not complete. Please try again later." });
     });
   }],

   /* Register user for an event */
   ['/events/:id/register' , [
     check('id', 'User ID must be supplied and valid').isInt(),
     check('eventId', 'Event ID must be supplied and valid').isInt()
   ], (request, response) => {
     const errors = validationResult(request);
     if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
     }

     return response.status(418);
   }]
];

const GETS = [
  ['/test', isLoggedIn, (request, response) => {
    response.json({'data' : 'Butts'});
  }],

  ['/login', isLoggedIn, (request, response) => {
    response.json({
      success: true,
      user: scrubUser(request.user)
    });
  }],

  ['/users/:id?', isLoggedIn, [
    check('id', 'User ID must be supplied and valid').isInt()
  ], (request, response) => {
    getUserById(request.params.id).then(users => response.json(users))
  }],

  ['/users/:id/ticket/:eventId?', isLoggedIn, [
    check('id', 'User ID must be supplied and valid').isInt(),
    check('eventId', 'Event ID must be supplied and valid').isInt()
  ], (request, response) => {
    console.log("/users/" + request.params.id + "/ticket/" + request.params.eventId);
    getTicketStatus(request.params.id, request.params.eventId).then(
        status => {
            console.log("getTicketstatus: " + JSON.stringify(status));
            if (status.length == 0)
                return response.json({status: 'none'});
            return response.json(status);
        }).catch(e => console.log("getTicketStatus: " + JSON.stringify(e)));
  }],

  ['/events/:id?', isLoggedIn, (request, response) => {
    getEvent(request.params.id).then(events => response.json(events));
  }],

  ['/event/:id/lottery', isLoggedIn, [
    check('id', 'No event id specified').isInt(),
  ], (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    return response.status(418);
  }],

  ['/events/:id/departments', isLoggedIn, (request, response) => {
    getDepartments(request.params.id).then(departments => response.json({ departments }));
  }],

  ['/events/:id/lead', isLoggedIn, (request, response) => {
    getEvent(request.params.id)
        .then(event => getUserById(event.lead))
        .then(lead => response.json(lead));
  }]
];

POSTS.forEach(config => router.post(...config));
GETS.forEach(config => router.get(...config));

// TODO: Reuse the fetch code from the client when code sharing happens
function handleResponse(response) {
  return response.json().then(data => {
    return ({ status: response.status, data });
  });
}

router.post('/batch', (request, response) => {

  // TODO: Reuse the fetch code from the client when code sharing happens
  // TODO: Also, it would be more efficient if it didn't actually fire new http requests
  // TODO: Also, it should consolidate duplicate calls
  const subrequests = request.body.requests.map(subrequest => fetch(
    `http://${HOST}:${config.get('server.port')}/api/${subrequest.endpoint}`,
    {
      method: subrequest.method,
      headers: {
        'Authorization': request.headers.authorization,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subrequest.data)
    }
  ).then(r => {
    return handleResponse(r).then(data => ({
      [subrequest.endpoint]: JSON.stringify(data)
    }));
  }));

  Promise.all(subrequests).then(responses => {
    const data = responses.reduce((ret, subresponse) =>
        Object.assign(ret, subresponse), {});
    response.json(data);
  });
});

router.use((request, response) => {
  response.status(404).send("{}");
});

export default router;
