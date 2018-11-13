import React from 'react';
import { concat } from '../util';

import style from './FormField.less';

class FormField extends React.Component {
  state = { displayAsDate: false }
  render() {
    const { type, icon, title, name, value = '', isError, onChange } = this.props;
    const { displayAsDate } = this.state;
    return (
      <div className={style.wrap}>
        <input className={concat(style.input, value ? style.filled : '')}
              value={value}
              name={name}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => type === 'date' && this.setState({ displayAsDate: true })}
              onBlur={() => type === 'date' && this.setState({ displayAsDate: !!value })}
              type={type === 'date' && !displayAsDate ? 'text' : type} />
        <div className={concat(style.placeholder, icon ? style.withIcon : '', isError ? style.error : null)}
            style={ icon ? { backgroundImage: `url(${icon})` } : null }>
          {title}
        </div>
      </div>
    );
  }
}
export default FormField;