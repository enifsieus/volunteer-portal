/**
 * Reducers related to authentication
 *
 * @author mtownsend
 * @since Oct 2017
 */

import {
  REGISTERING, REGISTERED
} from '../actions/register';

export default (state = { loggedIn: false, token: null, user: null }, action) => {
  switch (action.type) {
    case LOGGING_IN:
      return Object.assign({}, state, { status: LOGGING_IN });
    case LOGGED_IN:
      if (state.status !== LOGGING_IN) {
        // Login was aborted on the client-side
        return state;
      }
      return { loggedIn: true, token: action.token, user: action.user };
    case LOGGED_OUT:
      return { loggedIn: false, token: null, user: null };
    case LOGIN_FAILED:
      return { loggedIn: false, token: null, user: null, status: LOGIN_FAILED};
    case SIGNING_UP:
      return Object.assign({}, state, { status: SIGNING_UP });
    case SIGNED_UP:
      return Object.assign({}, state, { status: SIGNED_UP });
    case SIGNUP_FAILED:
      return Object.assign({}, state, { status: SIGNUP_FAILED, reason: action.reason, errors: action.errors });
    default:
      return state;
  }
}