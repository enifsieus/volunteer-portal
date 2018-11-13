import React from 'react';

import { concat } from '../util';

import emailSvg from '../images/email.svg';
import lockSvg from '../images/lock.svg';
import dateSvg from '../images/date.svg';

import style from './Auth.less';
import theme from '../theme.css';

import Button from './Button';
import FormField from './FormField';
import { FormattedMessage } from 'react-intl';

import { SIGNUP_FAILED } from '../actions/auth.js';

import { isInError, labelFor } from '../util';

function submitSignup(e, state, onSignup) {
  e.preventDefault();
  onSignup(state);
}

export const SignupForm = ({ state, status, errors, onSignup, onChange }) => (
  <form onSubmit={e => submitSignup(e, state, onSignup)}>
    {
      status === SIGNUP_FAILED ?
        <div className={style.error}>
          <FormattedMessage id="signup.failed" defaultMessage={errors && errors.length > 0 ? "Please correct any errors below to complete your reigstration." : "Unknown signup failure"} />
        </div> : null
    }
    <FormField name="firstName"
               value={state.firstName}
               isError={isInError('firstName', errors)}
               onChange={v => onChange('firstName', v)}
               title={<FormattedMessage
                   id="user.firstName"
                   defaultMessage={labelFor('firstName', "First Name", errors)} />} />
    <FormField name="lastName"
               value={state.lastName}
               isError={isInError('lastName', errors)}
               onChange={v => onChange('lastName', v)}
               title={<FormattedMessage
                   id="user.lastName"
                   defaultMessage={labelFor('lastName', "Last Name", errors)} />} />
    <FormField name="burnName"
               value={state.burnName}
               isError={isInError('burnName', errors)}
               onChange={v => onChange('burnName', v)}
               title={<FormattedMessage
                   id="user.burnName"
                   defaultMessage={labelFor('burnName', "Burn Name", errors)} />} />
    <FormField icon={emailSvg}
               name="email"
               isError={isInError('email', errors)}
               value={state.email}
               onChange={v => onChange('email', v)}
               title={<FormattedMessage
                   id="user.email"
                   defaultMessage={labelFor('email', "Email Address", errors)} />} />
    <FormField icon={dateSvg}
               type="date"
               name="dateOfBirth"
               isError={isInError('dateOfBirth', errors)}
               value={state.dateOfBirth}
               onChange={v => onChange('dateOfBirth', v)}
               title={<FormattedMessage
                   id="user.dateOfBirth"
                   defaultMessage={labelFor('dateOfBirth', 'Date of Birth', errors)} />} />
    <FormField type="password"
               icon={lockSvg}
               name="password"
               isError={isInError('password', errors)}
               value={state.password}
               onChange={v => onChange('password', v)}
               title={<FormattedMessage
                   id="user.password"
                   defaultMessage={labelFor('password', "Password", errors)} />} />
    <FormField type="password"
               icon={lockSvg}
               name="repeatpassword"
               isError={isInError('repeatpassword', errors)}
               value={state.repeatpassword}
               onChange={v => onChange('repeatpassword', v)}
               title={<FormattedMessage
                   id="user.repeatpassword"
                   defaultMessage={labelFor('repeatpassword', "Repeat Password", errors)} />} />
    <Button type="submit"
            border={true}
            className={concat(style.button, theme.txt_darkest)}
            text={<FormattedMessage id="login.signUp" defaultMessage="Sign Up" />} />
  </form>
);

