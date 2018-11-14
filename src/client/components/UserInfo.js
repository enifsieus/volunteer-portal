import React from 'react';
import { concat } from '../util';
import Avatar from './Avatar';
import UserMenu from './UserMenu';
import style from './UserInfo.less';
import theme from '../theme.css';

export default ({ userName, avatarUrl, menuLabel, small }) => (
  <div className={concat(style.UserInfo, small ? style.small : style.big)}>
    <div className={small ? style.smallContent : style.bigContent}>
      <span className={small ? concat(theme.txt_light, style.smallName) :
                               style.bigName}>{userName}</span>
      <UserMenu label={small ? null : menuLabel} />
    </div>
  </div>
);