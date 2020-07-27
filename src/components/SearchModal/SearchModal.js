import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEqual,
  omit,
} from 'lodash';

import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import {
  Modal,
  Pane,
  Paneset,
  Icon,
  Button,
} from '@folio/stripes/components';

import SearchForm from '../SearchForm';
import SearchResultsList from '../SearchResultsList';
import {
  searchFiltersConfig,
  packageResponseShape,
  searchTypes,
  searchTypesTranslationIDs,
  titleSearchFields,
} from '../../constants';

import css from './SearchModal.css';


const propTypes = {
  isMultiSelect: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRecordChosen: PropTypes.func.isRequired,
  mutator: PropTypes.shape({
    packages: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }).isRequired,
    titles: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    packages: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      isPending: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.arrayOf(packageResponseShape).isRequired,
        meta: PropTypes.shape({
          totalResults: PropTypes.number.isRequired,
        }).isRequired,
      })).isRequired,
    }),
    tags: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.shape({
        tags: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })).isRequired,
      })).isRequired,
    }),
    accessTypes: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          attributes: PropTypes.shape({
            name: PropTypes.shape.isRequired,
          }).isRequired,
        })).isRequired,
      })).isRequired,
    }),
  }).isRequired,
};

const SearchModal = ({
  open,
  onRecordChosen,
  onClose,
  mutator,
  resources,
  isMultiSelect,
}) => {
  const getInitialFiltersState = searchType => searchFiltersConfig[searchType].reduce((filtersState, filter) => ({
    ...filtersState,
    [filter.name]: filter.defaultValue,
  }), {});

  const getInitialSearchConfig = searchType => {
    const searchConfig = {
      selectedItems: [],
      lastFetchedPage: 0,
      searchQuery: '',
      searchFilters: getInitialFiltersState(searchType),
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: false,
    };

    if (searchType === searchTypes.TITLE) {
      searchConfig.searchField = titleSearchFields.TITLE;
    }

    return searchConfig;
  };

  const [searchType, setSearchType] = useState(searchTypes.PACKAGE);
  const [packageSearchConfig, setPackageSearchConfig] = useState(() => getInitialSearchConfig(searchTypes.PACKAGE));
  const [titlesSearchConfig, setTitleSearchConfig] = useState(() => getInitialSearchConfig(searchTypes.TITLE));

  const handleSearchConfigChange = updater => {
    if (searchType === searchTypes.PACKAGE) {
      setPackageSearchConfig(updater);
    } else {
      setTitleSearchConfig(updater);
    }
  };

  const currentSearchConfig = searchType === searchTypes.PACKAGE
    ? packageSearchConfig
    : titlesSearchConfig;

  const resourcesToBeDisplayed = searchType === searchTypes.PACKAGE
    ? resources?.packages
    : resources?.titles;

  const hasLoaded = !!resourcesToBeDisplayed.packages?.hasLoaded;
  const fetchIsPending = !hasLoaded && resourcesToBeDisplayed?.isPending;

  const tagsLoaded = !!resources.tags?.hasLoaded;
  const tagsExist = tagsLoaded && !!resources.tags?.records[0]?.tags?.length;

  const accessTypesLoaded = !!resources.accessTypes?.hasLoaded;
  const accessTypesExist = accessTypesLoaded && !!resources.accessTypes?.records[0]?.data?.length;

  const formattedTags = tagsExist
    ? resources.tags?.records[0]?.tags.map(({ label }) => ({ value: label, label }))
    : [];

  const formattedAccessTypes = accessTypesExist
    ? resources.accessTypes?.records[0]?.data.map(({ attributes }) => ({ value: attributes.name, label: attributes.name }))
    : [];

  const getFormattedListItems = () => {
    if (!resourcesToBeDisplayed?.hasLoaded) {
      return [];
    }

    const records = resourcesToBeDisplayed.records;

    return records
      .reduce((acc, rec) => [...acc, ...rec.data], [])
      .map(({ attributes, id, type }) => ({
        ...attributes,
        id,
        type,
        checked: !!currentSearchConfig.selectedItems.find(item => item.id === id),
      }));
  };

  const getTotalResults = () => {
    if (!resourcesToBeDisplayed?.hasLoaded) {
      return null;
    }

    const records = resourcesToBeDisplayed.records;

    return records[records.length - 1].meta.totalResults;
  };

  const formattedResults = getFormattedListItems();
  const totalResults = getTotalResults();

  const fetchItems = async ({
    searchQuery: query,
    searchFilters: filters,
    page,
  }) => {
    const {
      sort,
      tags,
      accessTypes,
      ...otherFilters
    } = filters;

    let params;

    if (currentSearchConfig.searchByTagsEnabled && tags?.length) {
      params = {
        'filter[tags]': tags.join(','),
      };
    } else if (currentSearchConfig.searchAccessTypesEnabled && accessTypes?.length) {
      params = {
        'filter[access-type]': accessTypes.join(','),
      };
    } else {
      const formattedFilters = Object.keys(otherFilters).reduce((acc, filterName) => {
        return otherFilters[filterName] !== 'all'
          ? {
            ...acc,
            [`filter[${filterName}]`]: otherFilters[filterName],
          }
          : { ...acc };
      }, {});

      params = {
        ...formattedFilters,
      };

      if (sort === 'name') {
        params.sort = sort;
      }

      if (searchType === searchTypes.TITLE) {
        const currentSearchField = currentSearchConfig.searchField === titleSearchFields.TITLE
          ? 'name'
          : currentSearchConfig.searchField;

        const searchFilterName = currentSearchField === titleSearchFields.TITLE
          ? 'name'
          : currentSearchField;

        params.searchfield = currentSearchField;
        params[`filter[${searchFilterName}]`] = query;
      } else {
        params.q = query;
      }
    }


    if (page) {
      params.page = page;
    }

    if (searchType === searchTypes.PACKAGE) {
      mutator.packages.GET({ params });
    } else {
      mutator.titles.GET({ params });
    }
  };

  const fetchNextPage = () => {
    const {
      lastFetchedPage,
      searchQuery,
      searchFilters,
    } = currentSearchConfig;

    const pageToFetch = lastFetchedPage + 1;

    fetchItems({
      searchQuery,
      searchFilters,
      page: pageToFetch
    });

    handleSearchConfigChange(prev => ({
      ...prev,
      lastFetchedPage: pageToFetch,
    }));
  };

  useEffect(() => {
    const {
      searchFilters,
      searchByTagsEnabled,
      searchAccessTypesEnabled,
      searchQuery,
    } = currentSearchConfig;
    const { tags, accessTypes, ...otherFilters } = searchFilters;

    const shouldPerformSearchByTags = searchByTagsEnabled && tags?.length;
    const shouldPerformSearchByAccessTypes = searchAccessTypesEnabled && accessTypes?.length;
    const shouldPerformRegularSearch =
      !searchByTagsEnabled
      && !searchAccessTypesEnabled
      && Object.keys(otherFilters).length && searchQuery;

    if (shouldPerformSearchByTags || shouldPerformRegularSearch || shouldPerformSearchByAccessTypes) {
      if (searchType === searchTypes.PACKAGE) {
        mutator.packages.reset();
      } else {
        mutator.titles.reset();
      }

      handleSearchConfigChange(prev => ({
        ...prev,
        lastFetchedPage: 1,
      }));

      fetchItems({
        searchQuery,
        searchFilters
      });
    }
  }, [
    currentSearchConfig.searchByTagsEnabled,
    currentSearchConfig.searchAccessTypesEnabled,
    currentSearchConfig.searchFilters,
  ]);

  const onSearchQueryChange = ({ target: { value } }) => {
    handleSearchConfigChange(prev => ({
      ...prev,
      searchQuery: value,
    }));
  };

  const onSearchFiltersChange = (filters) => {
    handleSearchConfigChange(prev => ({
      ...prev,
      searchFilters: filters,
    }));
  };

  const handleSearchFormSubmit = () => {
    if (searchType === searchTypes.PACKAGE) {
      mutator.packages.reset();
    } else {
      mutator.titles.reset();
    }

    handleSearchConfigChange(prev => ({
      ...prev,
      lastFetchedPage: 1,
    }));

    fetchItems({
      searchQuery: currentSearchConfig.searchQuery,
      searchFilters: currentSearchConfig.searchFilters,
    });
  };

  const isResetButtonDisabed = () => {
    const searchFormIsPristine = isEqual(getInitialFiltersState(searchType), currentSearchConfig.searchFilters);
    const searchQueryIsMissing = !currentSearchConfig.searchQuery;

    return searchFormIsPristine && searchQueryIsMissing;
  };

  const resetSearch = () => {
    if (searchType === searchTypes.PACKAGE) {
      mutator.packages.reset();
    } else {
      mutator.titles.reset();
    }

    handleSearchConfigChange(prev => ({
      ...prev,
      lastFetchedPage: 1,
      searchQuery: '',
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: false,
      searchFilters: getInitialFiltersState(searchType),
    }));
  };

  const closeModal = () => {
    setPackageSearchConfig(getInitialSearchConfig(searchTypes.PACKAGE));
    setTitleSearchConfig(getInitialSearchConfig(searchTypes.TITLE));

    onClose();
  };

  const handleRecordClick = item => {
    const { selectedItems } = currentSearchConfig;

    if (isMultiSelect) {
      const isAlreadySelected = !!selectedItems.find(selectedItem => selectedItem.id === item.id);
      const newSelectedItems = isAlreadySelected
        ? selectedItems.filter(selectedItem => item.id !== selectedItem.id)
        : [...selectedItems, item];

      handleSearchConfigChange(prev => ({
        ...prev,
        selectedItems: newSelectedItems,
      }));
    } else {
      closeModal();
      onRecordChosen(omit(item, ['checked']));
    }
  };

  const handleSave = () => {
    closeModal();
    console.log('selected', currentSearchConfig.selectedItems.map(item => omit(item, ['checked'])));
    onRecordChosen(currentSearchConfig.selectedItems.map(item => omit(item, ['checked'])));
  };

  const toggleSearchByTags = () => {
    handleSearchConfigChange(prev => ({
      ...prev,
      searchByTagsEnabled: !prev.searchByTagsEnabled,
      searchAccessTypesEnabled: false,
    }));
  };

  const toggleSearchByAccessTypes = () => {
    handleSearchConfigChange(prev => ({
      ...prev,
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: !prev.searchAccessTypesEnabled,
    }));
  };

  const handleTitleSearchFieldChange = newSearchField => {
    handleSearchConfigChange(prev => ({
      ...prev,
      searchField: newSearchField,
    }));
  };

  const renderSubHeader = () => {
    return hasLoaded
      ? (
        <FormattedMessage
          id="ui-plugin-find-package-title.resultsPane.resultsCount"
          values={{ totalResults }}
        />
      )
      : fetchIsPending
        ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.resultsCount.loading" />
        : '';
  };

  const renderModalFooter = () => {
    if (!isMultiSelect) {
      return null;
    }

    return (
      <div className={css.modalFooter}>
        <Button
          data-test-find-package-title-cancel
          onClick={closeModal}
          marginBottom0
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
        <div data-test-titles-selected-count>
          <FormattedMessage
            id="ui-plugin-find-package-title.resultsPane.totalSelected.count"
            values={{
              count: currentSearchConfig.selectedItems.length,
            }}
          />
        </div>
        <Button
          data-test-find-package-title-save
          marginBottom0
          buttonStyle="primary"
          onClick={handleSave}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </div>
    );
  };

  const modalLabel = searchType === searchTypes.PACKAGE
    ? <FormattedMessage id="ui-plugin-find-package-title.modal.label.package" />
    : <FormattedMessage id="ui-plugin-find-package-title.modal.label.title" />;

  return (
    <Modal
      open={open}
      dismissible
      contentClass={css.modalContent}
      label={modalLabel}
      onClose={closeModal}
      size="large"
      id="find-package-title-modal"
      footer={renderModalFooter()}
    >
      <Paneset static isRoot>
        <Pane
          defaultWidth="28%"
          paneTitle={<FormattedMessage id="ui-plugin-find-package-title.searchPane.label" />}
        >
          <SearchForm
            tagsExist={tagsExist}
            tagsFilterOptions={formattedTags}
            onSearch={fetchItems}
            searchByTagsEnabled={currentSearchConfig.searchByTagsEnabled}
            toggleSearchByTags={toggleSearchByTags}
            accessTypesFilterOptions={formattedAccessTypes}
            accessTypesExist={accessTypesExist}
            searchAccessTypesEnabled={currentSearchConfig.searchAccessTypesEnabled}
            toggleSearchByAccessTypes={toggleSearchByAccessTypes}
            resetButtonDisabled={isResetButtonDisabed()}
            searchQuery={currentSearchConfig.searchQuery}
            searchFilters={currentSearchConfig.searchFilters}
            titleSearchField={titlesSearchConfig.searchField}
            onTitleSearchFieldChange={handleTitleSearchFieldChange}
            onSearchQueryChange={onSearchQueryChange}
            onSearchFiltersChange={onSearchFiltersChange}
            onResetAll={resetSearch}
            onSubmit={handleSearchFormSubmit}
            onSearchTypeChange={setSearchType}
            searchType={searchType}
          />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={<FormattedMessage id={searchTypesTranslationIDs[searchType]} />}
          appIcon={<AppIcon app="eholdings" />}
          noOverflow
          padContent={false}
          paneSub={renderSubHeader()}
        >
          {!fetchIsPending
            ? (
              <SearchResultsList
                onRecordChosen={handleRecordClick}
                items={formattedResults}
                totalCount={totalResults}
                onNeedMoreData={fetchNextPage}
                hasLoaded={hasLoaded}
                isMultiSelect={isMultiSelect}
                searchType={searchType}
              />
            )
            : (
              <Icon icon="spinner-ellipsis" />
            )
          }
        </Pane>
      </Paneset>
    </Modal>
  );
};

SearchModal.manifest = {
  packages: {
    path: 'eholdings/packages',
    type: 'okapi',
    headers: {
      'accept': 'application/vnd.api+json'
    },
    fetch: false,
    accumulate: true,
  },
  titles: {
    path: 'eholdings/resources',
    type: 'okapi',
    headers: {
      'accept': 'application/vnd.api+json'
    },
    fetch: false,
    accumulate: true,
  },
  tags: {
    path: 'tags?limit=100000',
    type: 'okapi',
    fetch: true,
  },
  accessTypes: {
    path: 'eholdings/access-types',
    type: 'okapi',
    fetch: true,
    headers: {
      'accept': 'application/vnd.api+json'
    }
  },
};

SearchModal.propTypes = propTypes;

export default stripesConnect(SearchModal);
