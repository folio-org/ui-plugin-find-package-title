import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Layout,
} from '@folio/stripes/components';

import { packageAttributesFields } from '../../constants';

const propTypes = {
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
}) => {
  const emptyMessage = (
    <Layout className="display-flex centerContent">
      {hasLoaded
        ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.noPackagesFound" />
        : <FormattedMessage id="ui-plugin-find-package-title.resultsPane.emptyMessage" />
      }
    </Layout>
  );

  return (
    <MultiColumnList
      visibleColumns={['isSelected', 'name', 'selectedCount', 'titleCount']}
      columnMapping={{
        isSelected: <FormattedMessage id="ui-plugin-find-package-title.resultsPane.status" />,
        name: <FormattedMessage id="ui-plugin-find-package-title.resultsPane.name" />,
        selectedCount: <FormattedMessage id="ui-plugin-find-package-title.resultsPane.titlesSelected" />,
        titleCount: <FormattedMessage id="ui-plugin-find-package-title.resultsPane.totalTitles" />,
      }}
      columnWidths={{
        isSelected: '15%',
        name: '53%',
        selectedCount: '17%',
        titleCount: '15%',
      }}
      formatter={{
        isSelected: item => item.isSelected //eslint-disable-line
          ? <FormattedMessage id="ui-plugin-find-package-title.resultsPane.status.selected" />
          : <FormattedMessage id="ui-plugin-find-package-title.resultsPane.status.notSelected" />
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
