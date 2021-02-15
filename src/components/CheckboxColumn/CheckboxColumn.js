import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { Checkbox } from '@folio/stripes/components';

import css from './CheckboxColumn.css';

const CheckboxColumn = memo((props) => {
  const {
    checked,
    onChange,
    ...rest
  } = props;

  return (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
      tabIndex="0"
      role="button"
      className={css.selectableCellButton}
      onClick={e => e.stopPropagation()}
      {...rest}
    >
      <Checkbox
        checked={checked}
        onChange={onChange}
        data-testid="checkbox-column"
      />
    </div>
  );
});

CheckboxColumn.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

CheckboxColumn.defaultProps = {
  checked: false,
  onChange: noop,
};

export default CheckboxColumn;
