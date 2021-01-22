import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  SearchField,
  FilterAccordionHeader,
  Accordion,
  Checkbox,
} from '@folio/stripes/components';

import {
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import SearchFilters from '../SearchFilters';
import ResetButton from '../ResetButton';
import SearchTypeSwitcher from '../SearchTypeSwitcher';
import SearchFieldSelect from '../SearchFieldSelect';
import {
  searchFiltersConfig,
  searchFiltersShape,
  searchTypes,
} from '../../constants';

import css from './SearchForm.css';

const filterOptionsShape = PropTypes.arrayOf(PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}));

const propTypes = {
  accessTypesExist: PropTypes.bool.isRequired,
  accessTypesFilterOptions: filterOptionsShape.isRequired,
  tagsFilterOptions: filterOptionsShape.isRequired,
  tagsExist: PropTypes.bool.isRequired,
  searchByTagsEnabled: PropTypes.bool.isRequired,
  toggleSearchByTags: PropTypes.func.isRequired,
  searchAccessTypesEnabled: PropTypes.bool.isRequired,
  toggleSearchByAccessTypes: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  searchFilters: searchFiltersShape.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onSearchFiltersChange: PropTypes.func.isRequired,
  onResetAll: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resetButtonDisabled: PropTypes.bool.isRequired,
  onSearchTypeChange: PropTypes.func.isRequired,
  searchType: PropTypes.oneOf(searchTypes).isRequired,
  titleSearchField: PropTypes.string.isRequired,
  onTitleSearchFieldChange: PropTypes.func.isRequired,
};

const SearchForm = ({
  onSubmit,
  tagsExist,
  tagsFilterOptions,
  searchByTagsEnabled,
  toggleSearchByTags,
  searchQuery,
  searchFilters,
  onSearchQueryChange,
  onSearchFiltersChange,
  resetButtonDisabled,
  onResetAll,
  accessTypesExist,
  accessTypesFilterOptions,
  searchAccessTypesEnabled,
  toggleSearchByAccessTypes,
  onSearchTypeChange,
  searchType,
  titleSearchField,
  onTitleSearchFieldChange,
}) => {
  const renderAccessTypesFilter = () => {
    const accessTypesFilter = searchFilters.accessTypes || [];

    return (
      <div className={css.multiselectionFilter}>
        <Accordion
          closedByDefault
          displayClearButton={accessTypesFilter.length > 0}
          header={FilterAccordionHeader}
          id="clickable-access-types-filter"
          label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.accessTypes" />}
          separator={false}
          onClearFilter={() => onSearchFiltersChange({ ...searchFilters, accessTypes: undefined })}
        >
          <Checkbox
            label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.accessTypes.accessTypesOnly" />}
            onChange={toggleSearchByAccessTypes}
            checked={searchAccessTypesEnabled}
            data-test-toggle-search-by-access-types
          />
          <MultiSelectionFilter
            dataOptions={accessTypesFilterOptions}
            id="access-types-filter"
            name="access-type"
            disabled={!searchAccessTypesEnabled}
            onChange={({ values }) => onSearchFiltersChange({
              ...searchFilters,
              accessTypes: values
            })}
            selectedValues={accessTypesFilter}
          />
        </Accordion>
      </div>
    );
  };

  const renderTagsFilter = () => {
    const tagFilters = searchFilters.tags || [];

    return (
      <div className={css.multiselectionFilter}>
        <Accordion
          closedByDefault
          displayClearButton={tagFilters.length > 0}
          header={FilterAccordionHeader}
          id="clickable-tags-filter"
          label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.tags" />}
          separator={false}
          onClearFilter={() => onSearchFiltersChange({ ...searchFilters, tags: undefined })}
        >
          <Checkbox
            label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.tags.tagsOnly" />}
            onChange={toggleSearchByTags}
            checked={searchByTagsEnabled}
            data-test-toggle-search-by-tags
          />
          <MultiSelectionFilter
            dataOptions={tagsFilterOptions}
            id="tags-filter"
            name="tags"
            disabled={!searchByTagsEnabled}
            onChange={({ values }) => onSearchFiltersChange({
              ...searchFilters,
              tags: values
            })}
            selectedValues={tagFilters}
          />
        </Accordion>
      </div>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit();
  };

  return (
    <>
      <SearchTypeSwitcher
        currentSearchType={searchType}
        onSearchTypeChange={onSearchTypeChange}
      />
      <form onSubmit={handleSubmit}>
        {searchType === searchTypes.TITLE && (
          <SearchFieldSelect
            value={titleSearchField}
            onChange={onTitleSearchFieldChange}
          />
        )}
        <FormattedMessage id="ui-plugin-find-package-title.searchableEntity.package">
          {ariaLabel => (
            <SearchField
              autoFocus
              onChange={onSearchQueryChange}
              placeholder={ariaLabel}
              ariaLabel={ariaLabel}
              value={searchQuery}
              disabled={searchByTagsEnabled || searchAccessTypesEnabled}
              data-test-find-package-title-search-field
            />
          )}
        </FormattedMessage>
        <Button
          buttonStyle="primary"
          fullWidth
          disabled={!searchQuery || searchByTagsEnabled || searchAccessTypesEnabled}
          type="submit"
          data-test-find-package-title-search-button
        >
          <FormattedMessage id="ui-plugin-find-package-title.searchPane.searchButton.label" />
        </Button>
        <ResetButton
          label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.resetAll" />}
          disabled={resetButtonDisabled}
          onClick={onResetAll}
          data-test-find-package-title-reset-button
        />
        {searchType === searchTypes.PACKAGE && tagsExist && renderTagsFilter()}
        {searchType === searchTypes.PACKAGE && accessTypesExist && renderAccessTypesFilter()}
        <SearchFilters
          activeFilters={searchFilters}
          availableFilters={searchFiltersConfig[searchType]}
          onChange={onSearchFiltersChange}
          disabled={searchByTagsEnabled || searchAccessTypesEnabled}
        />
      </form>
    </>
  );
};

SearchForm.propTypes = propTypes;

export default SearchForm;
