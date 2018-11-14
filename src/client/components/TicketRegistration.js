import React from 'react';

import { concat } from '../util';

import style from './Auth.less';
import theme from '../theme.css';

import Button from './Button';
import FormField from './FormField';
import { FormattedMessage } from 'react-intl';

import { REGISTRATION_FAILED } from '../actions/register.js';

import { isInError, labelFor } from '../util';

function submitRegistration(e, firstName, lastName, onRegistration) {
  e.preventDefault();
  onRegistration({ firstName, lastName });
}

export const RegistrationForm = ({ firstName, lastName, status, errors, onRegistration, onChange }) => (
  <form onSubmit={e => submitRegistration(e, { firstName, lastName }, onRegistration)}>
    {
      status === REGISTRATION_FAILED ?
        <div className={style.error}>
          <FormattedMessage id="registration.failed" defaultMessage={errors && errors.length > 0 ? "Please correct any errors below to complete your reigstration." : "Unknown signup failure"} />
        </div> : null
    }
    <FormField name="legalFirstName"
               value={firstName}
               isError={isInError('firstName', errors)}
               onChange={v => onChange('firstName', v)}
               title={<FormattedMessage
                   id="registration.firstName"
                   defaultMessage={labelFor('firstName', "Legal First Name", errors)} />} />
    <FormField name="lastName"
               value={lastName}
               isError={isInError('lastName', errors)}
               onChange={v => onChange('lastName', v)}
               title={<FormattedMessage
                   id="registration.lastName"
                   defaultMessage={labelFor('lastName', "Legal Last Name", errors)} />} />
    <Button type="submit"
            border={true}
            className={concat(style.button, theme.txt_darkest)}
            text={<FormattedMessage id="registration.register" defaultMessage="Register" />} />
  </form>
);

