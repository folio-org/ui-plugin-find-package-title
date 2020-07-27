import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Select } from '@folio/stripes/components';

import {
  titleSearchFields,
  titleSearchFieldsTranslationIDs,
} from '../../constants';

const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const SearchFieldSelect = ({
  value,
  onChange,
}) => {
  const handleSearchFieldChange = e => {
    onChange(e.target.value);
  };

  return (
    <FormattedMessage id="ui-plugin-find-package-title.searchPane.selectFieldToSearch">
      {(ariaLabel) => (
        <div data-test-search-field-select>
          <Select
            onChange={handleSearchFieldChange}
            value={value}
            aria-label={ariaLabel}
            data-test-search-field-select
          >
            {Object.values(titleSearchFields).map(searchField => (
              <FormattedMessage id={titleSearchFieldsTranslationIDs[searchField]}>
                {label => <option value={searchField}>{label}</option>}
              </FormattedMessage>
            ))}
          </Select>
        </div>
      )}
    </FormattedMessage>
  );
};

SearchFieldSelect.propTypes = propTypes;

export default SearchFieldSelect;
