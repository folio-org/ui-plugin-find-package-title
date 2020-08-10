import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
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
  const intl = useIntl();
  const handleSearchFieldChange = e => {
    onChange(e.target.value);
  };

  return (
    <div data-test-search-field-select>
      <Select
        onChange={handleSearchFieldChange}
        value={value}
        aria-label={intl.formatMessage({ id: 'ui-plugin-find-package-title.searchPane.selectFieldToSearch' })}
        data-test-search-field-select
      >
        {Object.values(titleSearchFields).map(searchField => (
          <option value={searchField}>
            {intl.formatMessage({ id: titleSearchFieldsTranslationIDs[searchField] })}
          </option>
        ))}
      </Select>
    </div>
  );
};

SearchFieldSelect.propTypes = propTypes;

export default SearchFieldSelect;
