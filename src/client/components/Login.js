import React from 'react';

import { concat } from '../util';

import emailSvg from '../images/email.svg';
import lockSvg from '../images/lock.svg';

import style from './Auth.less';
import theme from '../theme.css';

import Button from './Button';
import FormField from './FormField';
import { FormattedMessage } from 'react-intl';

function submitLogin(e, state, onLogin) {
  e.preventDefault();
  const { email, password } = state;
  email && password && onLogin(email, password);
}

export default ({ state, status, onLogin, onChange }) => (
  <form onSubmit={e => submitLogin(e, state, onLogin)}>
    <section className={style.temp}>
      The login is butts@butts.com : buttsRgr8
    </section>
    {status === 'LOGIN_FAILED' ? <div className={style.error}><FormattedMessage id="login.failed" defaultMessage="Incorrect email or password." /></div> : null}
    <FormField icon={emailSvg}
               name="email"
               value={state.email}
               onChange={v => onChange('email', v)}
               title={<FormattedMessage
                   id="user.email"
                   defaultMessage="Email Address" />} />
    <FormField type="password"
               icon={lockSvg}
               name="password"
               value={state.password}
               onChange={v => onChange('password', v)}
               title={<FormattedMessage
                   id="user.password"
                   defaultMessage="Password" />} />
    <div className={concat(theme.txt_2, style.forgot)}>
      <FormattedMessage id="login.forgot" defaultMessage="Forgot your password?" />
    </div>
    <Button type="submit"
            border={true}
            className={concat(style.button, theme.txt_darkest)}
            text={<FormattedMessage id="login.signin" defaultMessage="Sign In" />} />
  </form>
);
