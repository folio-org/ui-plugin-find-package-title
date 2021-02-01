import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import {
  searchTypes,
  searchTypesTranslationIDs,
} from '../../constants';

const propTypes = {
  currentSearchType: PropTypes.oneOf(Object.values(searchTypes)).isRequired,
  onSearchTypeChange: PropTypes.func.isRequired,
};

const SearchTypeSwitcher = ({
  currentSearchType,
  onSearchTypeChange,
}) => (
  <ButtonGroup
    fullWidth
    role="tablist"
  >
    {Object.values(searchTypes).map(type => (
      <Button
        role="tab"
        aria-selected={currentSearchType === type}
        aria-controls={`${type}-panel`}
        id={`${type}-tab`}
        key={type}
        onClick={() => onSearchTypeChange(type)}
        buttonStyle={type === currentSearchType ? 'primary' : 'default'}
        data-testid={`${type}-search-type-button`}
      >
        <FormattedMessage id={searchTypesTranslationIDs[type]} />
      </Button>
    ))}
  </ButtonGroup>
);

SearchTypeSwitcher.propTypes = propTypes;

export default SearchTypeSwitcher;
