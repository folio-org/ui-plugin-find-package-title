import { useState, useEffect } from 'react';
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
import selectTypesTranslationIDs from '../../constants/selectTypesTranslationIDs';

const propTypes = {
  containerRef: PropTypes.func,
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
  containerRef,
}) => {
  const intl = useIntl();
  const [, setItemsAreLoaded] = useState(false);

  useEffect(() => {
    // MCL resets the actual height of the modal-content
    const timerId = setTimeout(() => setItemsAreLoaded(!!items.length));
    return () => clearTimeout(timerId);
  }, [items]);

  const currentSearchType = searchType === searchTypes.PACKAGE;
  const messageForLoadedData = currentSearchType
    ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noPackagesFound" />
    : <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noTitlesFound" />;

  const emptyMessage = (
    <Layout className="display-flex centerContent">
      {hasLoaded
        ? (
          <NoResultsMessage>
            {messageForLoadedData}
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
    const visibleColumns = currentSearchType
      ? ['isSelected', 'name', 'selectedCount', 'titleCount']
      : ['isSelected', 'name', 'packageName', 'publisherName', 'publicationType'];

    return isMultiSelect
      ? ['checked', ...visibleColumns]
      : visibleColumns;
  };

  const getColumnWidths = () => {
    const columnWidths = currentSearchType
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

    if (!isMultiSelect) {
      return columnWidths;
    }

    return {
      ...columnWidths,
      checked: '5%',
      name: currentSearchType ? '48%' : '25%',
    };
  };

  return (
    <MultiColumnList
      visibleColumns={getVisibleColumns()}
      columnMapping={{
        isSelected: intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status' }),
        name: currentSearchType
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
        isSelected: item => (item.isSelected
          ? intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status.selected' })
          : intl.formatMessage({ id: 'ui-plugin-find-package-title.resultsPane.status.notSelected' })),
        checked: item => (
          <CheckboxColumn
            checked={item.checked}
            onChange={() => onRecordChosen(item)}
            ariaLabel={intl.formatMessage({ id: selectTypesTranslationIDs[item.type] ?? 'ui-plugin-find-package-title.resultsPane.select' }, { name: item.name })}
          />
        )
      }}
      contentData={items}
      isEmptyMessage={emptyMessage}
      totalCount={totalCount}
      onNeedMoreData={onNeedMoreData}
      pagingType="prev-next"
      hidePageIndices
      onRowClick={(_e, item) => { onRecordChosen(item); }}
      autosize
      pageAmount={25}
      containerRef={containerRef}
    />
  );
};

SearchResultsList.propTypes = propTypes;

export default SearchResultsList;
