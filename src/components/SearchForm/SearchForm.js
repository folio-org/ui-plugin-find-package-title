import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

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
  searchType: PropTypes.oneOf(Object.values(searchTypes)).isRequired,
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
  const intl = useIntl();

  const renderAccessTypesFilter = () => {
    const accessTypesFilter = searchFilters.accessTypes || [];

    return (
      <div
        className={css.multiselectionFilter}
        data-testid="access-type-filter"
      >
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
            data-testid="toggle-search-by-access-types"
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
            aria-label={intl.formatMessage({ id: 'ui-plugin-find-package-title.searchPane.filters.accessTypes' })}
          />
        </Accordion>
      </div>
    );
  };

  const renderTagsFilter = () => {
    const tagFilters = searchFilters.tags || [];

    return (
      <div
        className={css.multiselectionFilter}
        data-testid="tags-filter"
      >
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
            data-testid="toggle-search-by-tags"
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
            aria-label={intl.formatMessage({ id: 'ui-plugin-find-package-title.searchPane.filters.tags' })}
          />
        </Accordion>
      </div>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit();
  };

  const searchFieldLabel = intl.formatMessage({ id: `ui-plugin-find-package-title.searchableEntity.${searchType}` });

  return (
    <>
      <SearchTypeSwitcher
        currentSearchType={searchType}
        onSearchTypeChange={onSearchTypeChange}
      />
      <form onSubmit={handleSubmit} id="filters-panel">
        {searchType === searchTypes.TITLE && (
          <SearchFieldSelect
            value={titleSearchField}
            onChange={onTitleSearchFieldChange}
          />
        )}
        <SearchField
          autoFocus
          onChange={onSearchQueryChange}
          placeholder={searchFieldLabel}
          ariaLabel={searchFieldLabel}
          value={searchQuery}
          disabled={searchByTagsEnabled || searchAccessTypesEnabled}
          data-testid="find-package-title-search-field"
        />
        <Button
          buttonStyle="primary"
          fullWidth
          disabled={!searchQuery || searchByTagsEnabled || searchAccessTypesEnabled}
          type="submit"
          data-testid="find-package-title-search-button"
        >
          <FormattedMessage id="ui-plugin-find-package-title.searchPane.searchButton.label" />
        </Button>
        <ResetButton
          label={<FormattedMessage id="ui-plugin-find-package-title.searchPane.resetAll" />}
          disabled={resetButtonDisabled}
          onClick={onResetAll}
        />
        {tagsExist && renderTagsFilter()}
        {accessTypesExist && renderAccessTypesFilter()}
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
