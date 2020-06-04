import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';

import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';

import {
  Modal,
  Pane,
  Paneset,
  Icon,
} from '@folio/stripes/components';

import SearchForm from '../SearchForm';
import SearchResultsList from '../SearchResultsList';
import {
  packageFilters,
  packageResponseShape,
} from '../../constants';

import css from './SearchModal.css';


const propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRecordChosen: PropTypes.func.isRequired,
  mutator: PropTypes.shape({
    packages: PropTypes.shape({
      GET: PropTypes.func.isRequired,
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
}) => {
  const [lastFetchedPage, setLastFetchedPage] = useState(0);

  const getInitialFiltersState = () => packageFilters.reduce((filtersState, filter) => ({
    ...filtersState,
    [filter.name]: filter.defaultValue,
  }), {});

  const hasLoaded = !!resources.packages?.hasLoaded;
  const fetchIsPending = !hasLoaded && resources.packages?.isPending;

  const initialFiltersState = useMemo(getInitialFiltersState, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState(initialFiltersState);

  const [searchByTagsEnabled, setSearchByTagsEnabled] = useState(false);
  const [searchAccessTypesEnabled, setSearchAccessTypesEnabled] = useState(false);

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
    if (!resources?.packages?.hasLoaded) {
      return [];
    }

    const records = resources.packages.records;

    return records
      .reduce((acc, rec) => [...acc, ...rec.data], [])
      .map(({ attributes, id, type }) => ({ ...attributes, id, type }));
  };

  const getTotalResults = () => {
    if (!resources?.packages?.hasLoaded) {
      return null;
    }

    const records = resources.packages.records;

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

    if (searchByTagsEnabled && tags?.length) {
      params = {
        'filter[tags]': tags.join(','),
      };
    } else if (searchAccessTypesEnabled && accessTypes?.length) {
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
        q: query,
        ...formattedFilters,
      };

      if (sort === 'name') {
        params.sort = sort;
      }
    }

    if (page) {
      params.page = page;
    }

    mutator.packages.GET({ params });
  };

  const fetchNextPage = () => {
    const pageToFetch = lastFetchedPage + 1;

    fetchItems({
      searchQuery,
      searchFilters,
      page: pageToFetch
    });

    setLastFetchedPage(pageToFetch);
  };

  useEffect(() => {
    const { tags, accessTypes, ...otherFilters } = searchFilters;

    const shouldPerformSearchByTags = searchByTagsEnabled && tags?.length;
    const shouldPerformSearchByAccessTypes = searchAccessTypesEnabled && accessTypes?.length;
    const shouldPerformRegularSearch =
      !searchByTagsEnabled
      && !searchAccessTypesEnabled
      && Object.keys(otherFilters).length && searchQuery;

    if (shouldPerformSearchByTags || shouldPerformRegularSearch || shouldPerformSearchByAccessTypes) {
      mutator.packages.reset();
      setLastFetchedPage(1);

      fetchItems({
        searchQuery,
        searchFilters
      });
    }
  }, [searchByTagsEnabled, searchAccessTypesEnabled, searchFilters]);

  const onSearchQueryChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFormSubmit = () => {
    mutator.packages.reset();
    setLastFetchedPage(1);

    fetchItems({
      searchQuery,
      searchFilters
    });
  };

  const resetButtonDisabled = isEqual(initialFiltersState, searchFilters) && !searchQuery;

  const resetSearch = () => {
    mutator.packages.reset();
    setSearchQuery('');
    setSearchByTagsEnabled(false);
    setSearchAccessTypesEnabled(false);
    setSearchFilters(getInitialFiltersState());
  };

  const closeModal = () => {
    resetSearch();
    onClose();
  };

  const handleRecordClick = item => {
    closeModal();
    onRecordChosen(item);
  };

  const toggleSearchByTags = () => {
    setSearchByTagsEnabled(enabled => !enabled);
    setSearchAccessTypesEnabled(false);
  };

  const toggleSearchByAccessTypes = () => {
    setSearchAccessTypesEnabled(enabled => !enabled);
    setSearchByTagsEnabled(false);
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

  return (
    <Modal
      open={open}
      dismissible
      contentClass={css.modalContent}
      label={<FormattedMessage id="ui-plugin-find-package-title.modal.label.selectPackage" />}
      onClose={closeModal}
      size="large"
      id="find-package-title-modal"
    >
      <Paneset static isRoot>
        <Pane
          defaultWidth="30%"
          paneTitle={<FormattedMessage id="ui-plugin-find-package-title.searchPane.label" />}
        >
          <SearchForm
            tagsExist={tagsExist}
            tagsFilterOptions={formattedTags}
            onSearch={fetchItems}
            searchByTagsEnabled={searchByTagsEnabled}
            toggleSearchByTags={toggleSearchByTags}
            accessTypesFilterOptions={formattedAccessTypes}
            accessTypesExist={accessTypesExist}
            searchAccessTypesEnabled={searchAccessTypesEnabled}
            toggleSearchByAccessTypes={toggleSearchByAccessTypes}
            resetButtonDisabled={resetButtonDisabled}
            searchQuery={searchQuery}
            searchFilters={searchFilters}
            onSearchQueryChange={onSearchQueryChange}
            onSearchFiltersChange={setSearchFilters}
            onResetAll={resetSearch}
            onSubmit={handleSearchFormSubmit}
          />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={<FormattedMessage id="ui-plugin-find-package-title.searchableEntity.package" />}
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
