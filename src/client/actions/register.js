/**
 * Actions related to authentication
 *
 * @author mtownsend
 * @since Oct 2017
 **/
import { push } from 'react-router-redux';
import * as api from '../api';

import { invalidate } from './serviceCache';

export const REGISTERING         = 'REGISTERING';
export const REGISTERED          = 'REGISTERED';
export const REGISTRATION_FAILED = 'REGISTRATION_FAILED';

function registering() {
  return { type: REGISTERING };
}

function registered() {
  return { type: REGISTERED };
}

/*
 * @param reason - Reason for failure
 * @param errors - Field-level errors, keyed by field id
 */
function registrationFailed(reason, errors) {
  return {
    type: REGISTRATION_FAILED,
    reason: reason,
    errors: errors
  };
}

export function register(eventId, legalFirstName, legalLastName) {
    return dispatch => {
      dispatch(registering());
      api.post('events/${eventId}/register', null, { legalFirstName, legalLastName }).then(response => {
        if (response.status !== 200) {
          dispatch(registrationFailed("Registration could not be completed.", response.data.errors));
          return;
        }
        dispatch(registered);
      }).catch(error=> {
        dispatch(registrationFailed(error));
      });
    }
}



