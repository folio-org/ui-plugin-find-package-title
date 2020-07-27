import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  MultiColumnList,
  Layout,
} from '@folio/stripes/components';

import NoResultsMessage from '../NoResultsMessage';
import CheckboxColumn from '../CheckboxColumn';

import {
  packageAttributesFields,
  searchTypes,
} from '../../constants';

const propTypes = {
  isMultiSelect: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      ...packageAttributesFields,
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ])).isRequired,
  onRecordChosen: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  onNeedMoreData: PropTypes.func.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  searchType: PropTypes.oneOf(searchTypes).isRequired,
};

const defaultProps = {
  totalCount: null,
};

const SearchResultsList = ({
  items,
  onRecordChosen,
  totalCount,
  onNeedMoreData,
  hasLoaded,
  isMultiSelect,
  searchType,
}) => {
  const intl = useIntl();

  const emptyMessage = (
    <Layout className="display-flex centerContent">
      {hasLoaded
        ? (
          <NoResultsMessage data-test-no-results-message>
            <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noPackagesFound" />
          </NoResultsMessage>
        )
        : (
          <NoResultsMessage data-test-search-prompt>
            <FormattedMessage id="ui-plugin-find-package-title.resultsPane.emptyMessage" />
          </NoResultsMessage>
        )
      }
    </Layout>
  );

  const getVisibleColumns = () => {
    const visibleColumns = searchType === searchTypes.PACKAGE
      ? ['isSelected', 'name', 'selectedCount', 'titleCount']
      : ['isSelected', 'name', 'packageName', 'publicationType'];

    return isMultiSelect
      ? ['checked', ...visibleColumns]
      : visibleColumns;
  };

  const getColumnWidths = () => {
    const columnWidths = searchType === searchTypes.PACKAGE
      ? {
        isSelected: '15%',
        name: '53%',
        selectedCount: '17%',
        titleCount: '15%',
      }
      : {
        isSelected: '15%',
        name: '40%',
        packageName: '30%',
        publicationType: '15%',
      };

    return isMultiSelect
      ? {
        ...columnWidths,
        checked: '5%',
        name: searchType === searchTypes.PACKAGE ? '48%' : '35%',
      }
      : columnWidths;
  };

  return (
    <MultiColumnList
      visibleColumns={getVisibleColumns()}
      columnMapping={{
        isSelected: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status' }),
        name: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.name' }),
        selectedCount: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.titlesSelected' }),
        titleCount: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.totalTitles' }),
        checked: null,
        packageName: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.packageName' }),
        publicationType: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.publicationType' }),
      }}
      columnWidths={getColumnWidths()}
      formatter={{
        isSelected: item => item.isSelected //eslint-disable-line
          ? intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status.selected' })
          : intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status.notSelected' }),
        checked: item => (
          <CheckboxColumn
            checked={item.checked}
            onChange={() => onRecordChosen(item)}
          />
        )
      }}
      contentData={items}
      isEmptyMessage={emptyMessage}
      totalCount={totalCount}
      onNeedMoreData={onNeedMoreData}
      onRowClick={(_e, item) => { onRecordChosen(item); }}
      virtualize
      autosize
      pageAmount={25}
    />
  );
};

SearchResultsList.propTypes = propTypes;
SearchResultsList.defaultProps = defaultProps;

export default SearchResultsList;
