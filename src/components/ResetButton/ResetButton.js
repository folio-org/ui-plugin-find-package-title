import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ResetButton.css';

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

const ResetButton = ({
  id,
  label,
  className,
  disabled,
  onClick,
  ...restProps
}) => {
  return (
    <div className={css.resetButtonRoot}>
      <Button
        buttonStyle="none"
        id={id}
        onClick={onClick}
        disabled={disabled}
        buttonClass={classnames(css.button, className)}
        data-testid="reset-button"
        {...restProps}
      >
        <Icon size="small" icon="times-circle-solid">
          {label}
        </Icon>
      </Button>
    </div>
  );
};

ResetButton.propTypes = propTypes;

export default ResetButton;
