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

import { packageAttributesFields } from '../../constants';

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
    const visibleColumns = ['isSelected', 'name', 'selectedCount', 'titleCount'];

    return isMultiSelect
      ? ['checked', ...visibleColumns]
      : visibleColumns;
  };

  const getColumnWidths = () => {
    const columnWidths = {
      isSelected: '15%',
      name: '53%',
      selectedCount: '17%',
      titleCount: '15%',
    };

    return isMultiSelect
      ? {
        ...columnWidths,
        checked: '5%',
        name: '48%',
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
