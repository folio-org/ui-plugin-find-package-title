import {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEqual,
  omit,
  pickBy,
  uniqBy,
} from 'lodash';
import queryString from 'qs';

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

export const qs = {
  stringify: params => queryString.stringify(params, {
    encodeValuesOnly: true,
    indices: false,
  }),
};

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
    titles: PropTypes.shape({
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

const PAGE_SIZE = 25;

const SearchModal = ({
  open,
  onRecordChosen,
  onClose,
  mutator,
  resources,
  isMultiSelect,
}) => {
  const getInitialFiltersState = currentSearchType => {
    return searchFiltersConfig[currentSearchType].reduce((filtersState, filter) => ({
      ...filtersState,
      [filter.name]: filter.defaultValue,
    }), {});
  };

  const getInitialSearchConfig = currentSearchType => {
    const searchConfig = {
      selectedItems: [],
      currentPage: 0,
      lastFetchedPage: 0,
      searchQuery: '',
      searchFilters: getInitialFiltersState(currentSearchType),
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: false,
      offset: '',
    };

    if (currentSearchType === searchTypes.TITLE) {
      searchConfig.searchField = titleSearchFields.TITLE;
    }

    return searchConfig;
  };

  const [searchType, setSearchType] = useState(searchTypes.PACKAGE);
  const [packageSearchConfig, setPackageSearchConfig] = useState(() => getInitialSearchConfig(searchTypes.PACKAGE));
  const [titlesSearchConfig, setTitleSearchConfig] = useState(() => getInitialSearchConfig(searchTypes.TITLE));
  const isPackageSearch = searchType === searchTypes.PACKAGE;
  const okapiResource = isPackageSearch ? 'packages' : 'titles';

  const changeCurrentSearchConfig = updater => {
    if (isPackageSearch) {
      setPackageSearchConfig(updater);
    } else {
      setTitleSearchConfig(updater);
    }
  };

  const currentSearchConfig = isPackageSearch
    ? packageSearchConfig
    : titlesSearchConfig;

  const resourcesToBeDisplayed = resources?.[okapiResource];

  const hasLoaded = !!resourcesToBeDisplayed?.hasLoaded;
  const fetchIsPending = resourcesToBeDisplayed?.isPending;

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

  const getMappingData = ({ attributes, id, type }) => ({
    ...attributes,
    id,
    type,
    checked: !!currentSearchConfig.selectedItems.find(item => item.id === id),
  });

  const getFormattedResourcesData = titleRecords => {
    return titleRecords.reduce((allResources, currentTitle) => {
      const titleResources = currentTitle.included;
      const formattedTitleResources = titleResources.map(getMappingData);

      return [
        ...allResources,
        ...formattedTitleResources,
      ];
    }, []);
  };

  const getFormattedPackagesData = records => {
    return records.map(getMappingData);
  };

  const getFormattedListItems = () => {
    if (!resourcesToBeDisplayed?.hasLoaded) {
      return [];
    }

    const { records } = resourcesToBeDisplayed;

    const currentRecords = uniqBy(records[currentSearchConfig.currentPage]?.data, 'id');

    if (isPackageSearch) {
      return getFormattedPackagesData(currentRecords);
    }

    return getFormattedResourcesData(currentRecords);
  };

  const getTotalResults = () => {
    if (!resourcesToBeDisplayed?.hasLoaded) {
      return null;
    }

    const records = resourcesToBeDisplayed.records;

    return records[records.length - 1].meta.totalResults;
  };

  const formattedResults = getFormattedListItems();
  const paginatedResults = new Array(currentSearchConfig.currentPage * PAGE_SIZE);
  paginatedResults.push(...formattedResults);
  const totalResults = getTotalResults();

  const determineFiltersKeyword = (filters) => {
    if (currentSearchConfig.searchByTagsEnabled && filters.tags?.length) {
      return 'tags';
    } else if (currentSearchConfig.searchAccessTypesEnabled && filters.accessTypes?.length) {
      return 'accessTypes';
    }

    return 'otherFilters';
  };

  const getParams = ({
    otherFilters,
    sort,
    query,
  }) => {
    const formattedFilters = pickBy(otherFilters, (_, filterName) => otherFilters[filterName] !== 'all');

    const params = {
      filter: formattedFilters,
      ...(sort === 'name' && { sort }),
    };

    if (!isPackageSearch) {
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

    return params;
  };

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

    const paramsMap = {
      tags: () => ({ filter: { tags } }),
      accessTypes: () => ({ filter: { 'access-type': accessTypes } }),
      otherFilters: () => getParams({
        otherFilters,
        sort,
        query,
      }),
    };

    const keyword = determineFiltersKeyword(filters);
    const params = {
      ...paramsMap[keyword](),
      ...(page && { page }),
      include: 'resources',
    };

    const queryParams = qs.stringify(params);

    mutator[okapiResource].GET({ path: `eholdings/${okapiResource}?${queryParams}` });
  };

  const fetchNextPage = (...args) => {
    const [askAmount, , , offset] = args;
    const pagesAmount = resourcesToBeDisplayed.records.length;
    const {
      lastFetchedPage,
      searchQuery,
      searchFilters,
    } = currentSearchConfig;

    let pageToFetch = lastFetchedPage;

    if (totalResults > pagesAmount * askAmount) {
      pageToFetch++;
      fetchItems({
        searchQuery,
        searchFilters,
        page: pageToFetch
      });
    }

    changeCurrentSearchConfig(prev => ({
      ...prev,
      lastFetchedPage: pageToFetch,
      currentPage: offset === 'next' ? prev.currentPage + 1 : prev.currentPage - 1,
      offset,
    }));
  };

  useEffect(() => {
    const {
      searchFilters,
      searchByTagsEnabled,
      searchAccessTypesEnabled,
      searchQuery,
    } = currentSearchConfig;
    const {
      tags,
      accessTypes,
      ...otherFilters
    } = searchFilters;

    const shouldPerformSearchByTags = searchByTagsEnabled && tags?.length;
    const shouldPerformSearchByAccessTypes = searchAccessTypesEnabled && accessTypes?.length;
    const shouldPerformRegularSearch =
      !searchByTagsEnabled
      && !searchAccessTypesEnabled
      && Object.keys(otherFilters).length
      && searchQuery;

    if (shouldPerformSearchByTags || shouldPerformRegularSearch || shouldPerformSearchByAccessTypes) {
      mutator[okapiResource].reset();

      changeCurrentSearchConfig(prev => ({
        ...prev,
        currentPage: 0,
        lastFetchedPage: 1,
      }));

      fetchItems({
        searchQuery,
        searchFilters
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentSearchConfig.searchByTagsEnabled,
    currentSearchConfig.searchAccessTypesEnabled,
    currentSearchConfig.searchFilters,
  ]);

  const onSearchQueryChange = ({ target: { value } }) => {
    changeCurrentSearchConfig(prev => ({
      ...prev,
      searchQuery: value,
    }));
  };

  const onSearchFiltersChange = filters => {
    changeCurrentSearchConfig(prev => ({
      ...prev,
      searchFilters: filters,
    }));
  };

  const handleSearchFormSubmit = () => {
    mutator[okapiResource].reset();

    changeCurrentSearchConfig(prev => ({
      ...prev,
      lastFetchedPage: 1,
      currentPage: 0,
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
    mutator[okapiResource].reset();

    changeCurrentSearchConfig(prev => ({
      ...prev,
      currentPage: 0,
      lastFetchedPage: 1,
      searchQuery: '',
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: false,
      searchFilters: getInitialFiltersState(searchType),
      offset: '',
    }));
  };

  const closeModal = () => {
    setPackageSearchConfig(getInitialSearchConfig(searchTypes.PACKAGE));
    setTitleSearchConfig(getInitialSearchConfig(searchTypes.TITLE));
    setSearchType(searchTypes.PACKAGE);
    mutator.packages.reset();
    mutator.titles.reset();
    onClose();
  };

  const handleRecordClick = item => {
    const { selectedItems } = currentSearchConfig;

    if (isMultiSelect) {
      const isAlreadySelected = !!selectedItems.find(selectedItem => selectedItem.id === item.id);
      const newSelectedItems = isAlreadySelected
        ? selectedItems.filter(selectedItem => item.id !== selectedItem.id)
        : [...selectedItems, item];

      changeCurrentSearchConfig(prev => ({
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
    onRecordChosen(currentSearchConfig.selectedItems.map(item => omit(item, ['checked'])));
  };

  const toggleSearchByTags = () => {
    changeCurrentSearchConfig(prev => ({
      ...prev,
      searchByTagsEnabled: !prev.searchByTagsEnabled,
      searchAccessTypesEnabled: false,
    }));
  };

  const toggleSearchByAccessTypes = () => {
    changeCurrentSearchConfig(prev => ({
      ...prev,
      searchByTagsEnabled: false,
      searchAccessTypesEnabled: !prev.searchAccessTypesEnabled,
    }));
  };

  const handleTitleSearchFieldChange = newSearchField => {
    changeCurrentSearchConfig(prev => ({
      ...prev,
      searchField: newSearchField,
    }));
  };

  const renderSubHeader = () => {
    if (!hasLoaded) {
      return fetchIsPending
        ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.resultsCount.loading" />
        : '';
    }

    if (isPackageSearch) {
      return (
        <FormattedMessage
          id="ui-plugin-find-package-title.resultsPane.resultsCount"
          values={{ totalResults }}
        />
      );
    }

    return '';
  };

  const getFocusIndex = () => {
    if (currentSearchConfig.currentPage) {
      return (currentSearchConfig.currentPage * PAGE_SIZE).toString();
    }

    if (currentSearchConfig.offset) {
      return currentSearchConfig.currentPage.toString();
    }

    return null;
  };

  const focusFirstListItem = (listContainer) => {
    const focusIndex = getFocusIndex();

    if (focusIndex) {
      listContainer.querySelector(`[data-row-inner="${focusIndex}"]`)?.focus();
    }
  };

  const renderModalFooter = () => {
    if (!isMultiSelect) {
      return null;
    }

    return (
      <div
        className={css.modalFooter}
        data-testid="modal-footer"
      >
        <Button
          onClick={closeModal}
          marginBottom0
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
        <div>
          <FormattedMessage
            id="ui-plugin-find-package-title.resultsPane.totalSelected.count"
            values={{
              count: currentSearchConfig.selectedItems.length,
            }}
          />
        </div>
        <Button
          marginBottom0
          buttonStyle="primary"
          onClick={handleSave}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </div>
    );
  };

  const modalLabel = <FormattedMessage id={`ui-plugin-find-package-title.modal.label.${searchType}`} />;

  return (
    <Modal
      open={open}
      dismissible
      contentClass={css.modalContent}
      label={modalLabel}
      onClose={closeModal}
      size="large"
      id="find-package-title-modal"
      data-testid="find-package-title-modal"
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
                items={paginatedResults}
                totalCount={totalResults}
                onNeedMoreData={fetchNextPage}
                hasLoaded={hasLoaded}
                isMultiSelect={isMultiSelect}
                searchType={searchType}
                containerRef={ref => {
                  if (ref) {
                    focusFirstListItem(ref);
                  }
                }}
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
      'accept': 'application/vnd.api+json',
    },
    fetch: false,
    accumulate: true,
  },
  titles: {
    path: 'eholdings/titles',
    type: 'okapi',
    headers: {
      'accept': 'application/vnd.api+json',
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
      'accept': 'application/vnd.api+json',
    },
  },
};

SearchModal.propTypes = propTypes;

export default stripesConnect(SearchModal);
