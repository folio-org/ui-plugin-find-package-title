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
  searchType: PropTypes.oneOf(Object.values(searchTypes)).isRequired,
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
          <NoResultsMessage>
            {searchType === searchTypes.PACKAGE
              ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noPackagesFound" />
              : <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noTitlesFound" />
            }
          </NoResultsMessage>
        )
        : (
          <NoResultsMessage>
            <FormattedMessage id="ui-plugin-find-package-title.resultsPane.emptyMessage" />
          </NoResultsMessage>
        )
      }
    </Layout>
  );

  const getVisibleColumns = () => {
    const visibleColumns = searchType === searchTypes.PACKAGE
      ? ['isSelected', 'name', 'selectedCount', 'titleCount']
      : ['isSelected', 'name', 'packageName', 'publisherName', 'publicationType'];

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
        name: '30%',
        packageName: '20%',
        publisherName: '20%',
        publicationType: '15%',
      };

    return isMultiSelect
      ? {
        ...columnWidths,
        checked: '5%',
        name: searchType === searchTypes.PACKAGE ? '48%' : '25%',
      }
      : columnWidths;
  };

  return (
    <MultiColumnList
      visibleColumns={getVisibleColumns()}
      columnMapping={{
        isSelected: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status' }),
        name: searchType === searchTypes.PACKAGE
          ? intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.name' })
          : intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.title' }),
        selectedCount: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.titlesSelected' }),
        titleCount: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.totalTitles' }),
        checked: null,
        packageName: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.packageName' }),
        publisherName: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.publisher' }),
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

export default SearchResultsList;
