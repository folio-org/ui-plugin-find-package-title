import { memo } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { Checkbox } from '@folio/stripes/components';

import css from './CheckboxColumn.css';

const CheckboxColumn = memo((props) => {
  const {
    checked = false,
    onChange = noop,
    ariaLabel,
    ...rest
  } = props;

  return (
    <Checkbox
      className={css.selectableCellButton}
      checked={checked}
      onChange={onChange}
      onClick={e => e.stopPropagation()}
      data-testid="checkbox-column"
      aria-label={ariaLabel}
      {...rest}
    />
  );
});

CheckboxColumn.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string.isRequired
};

export default CheckboxColumn;
