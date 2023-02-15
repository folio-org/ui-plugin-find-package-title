import noop from 'lodash/noop';

import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import SearchResultsList from './SearchResultsList';
import { searchTypes } from '../../constants';

const renderSearchResultList = ({
  hasLoaded = true,
  isMultiSelect = false,
  items = [],
  onRecordChosen = noop,
  searchType = searchTypes.PACKAGE,
  totalCount = 0,
}) => render(
  <SearchResultsList
    hasLoaded={hasLoaded}
    isMultiSelect={isMultiSelect}
    items={items}
    onNeedMoreData={noop}
    onRecordChosen={onRecordChosen}
    searchType={searchType}
    totalCount={totalCount}
  />
);

const item = {
  contentType: 'content type',
  customCoverage: {
    beginCoverage: 'begin coverage',
    endCoverage: 'end coverage',
  },
  isCustom: true,
  isSelected: true,
  name: 'name',
  packageId: 1,
  packageType: 'package type',
  providerId: 1,
  providerName: 'provider name',
  selectedCount: 2,
  titleCount: 2,
  visibilityData: {
    isHidden: false,
    reason: 'reason',
  },
  id: 'id1',
  type: 'package',
};

describe('Given SearchResultList', () => {
  afterEach(cleanup);

  let items;
  let totalCount;
  let searchType;
  let isMultiSelect;

  describe('when data has not loaded', () => {
    it('should show empty message', () => {
      const { getByText } = renderSearchResultList({ hasLoaded: false });

      expect(getByText('ui-plugin-find-package-title.resultsPane.emptyMessage')).toBeDefined();
    });

    it('should render with no axe errors', async () => {
      const { container } = renderSearchResultList({ hasLoaded: false });

      await runAxeTest({
        rootNode: container,
      });
    });
  });

  describe('when search type is package', () => {
    describe('when empty data loaded for package', () => {
      it('should show message that packages not found', () => {
        const { getByText } = renderSearchResultList({});

        expect(getByText('ui-plugin-find-package-title.resultsPane.noPackagesFound')).toBeDefined();
      });

      it('should render with no axe errors', async () => {
        const { container } = renderSearchResultList({});

        await runAxeTest({
          rootNode: container,
        });
      });
    });

    describe('when data is loaded for package', () => {
      totalCount = 1;
      items = [item];

      it('should show correct table rows titles for packages', () => {
        const { getByText } = renderSearchResultList({
          items,
          totalCount,
        });

        expect(getByText('ui-plugin-find-package-title.resultsPane.name')).toBeDefined();
        expect(getByText('ui-plugin-find-package-title.resultsPane.titlesSelected')).toBeDefined();
        expect(getByText('ui-plugin-find-package-title.resultsPane.totalTitles')).toBeDefined();
      });

      it('should render with no axe errors', async () => {
        const { container } = renderSearchResultList({
          items,
          totalCount,
        });

        await runAxeTest({
          rootNode: container,
        });
      });
    });
  });

  describe('when search type is title', () => {
    searchType = searchTypes.TITLE;

    describe('when empty data loaded for title', () => {
      it('should show message that titles not found', () => {
        const { getByText } = renderSearchResultList({ searchType });

        expect(getByText('ui-plugin-find-package-title.resultsPane.noTitlesFound')).toBeDefined();
      });

      it('should render with no axe errors', async () => {
        const { container } = renderSearchResultList({ searchType });

        await runAxeTest({
          rootNode: container,
        });
      });
    });

    describe('when search type is title and search result list is multi select', () => {
      totalCount = 1;
      isMultiSelect = true;
      items = [{
        ...item,
        isSelected: false,
      }];

      it('should show correct table rows titles for titles', () => {
        const { getByText } = renderSearchResultList({
          items,
          isMultiSelect,
          searchType,
          totalCount,
        });

        expect(getByText('ui-plugin-find-package-title.resultsPane.title')).toBeDefined();
        expect(getByText('ui-plugin-find-package-title.resultsPane.packageName')).toBeDefined();
        expect(getByText('ui-plugin-find-package-title.resultsPane.publisher')).toBeDefined();
        expect(getByText('ui-plugin-find-package-title.resultsPane.publicationType')).toBeDefined();
      });

      it('should show not selected item', () => {
        const { getByText } = renderSearchResultList({
          items,
          isMultiSelect,
          searchType,
          totalCount,
        });

        expect(getByText('ui-plugin-find-package-title.resultsPane.status.notSelected')).toBeDefined();
      });

      describe('when click on checkbox', () => {
        it('should handle onRecordChosen', () => {
          const onRecordChosen = jest.fn();
          const { getByTestId } = renderSearchResultList({
            items,
            isMultiSelect,
            onRecordChosen,
            searchType,
            totalCount,
          });

          fireEvent.click(getByTestId('checkbox-column'));

          expect(onRecordChosen).toHaveBeenCalled();
        });
      });

      describe('when click on table row', () => {
        it('should handle onRecordChosen', () => {
          const onRecordChosen = jest.fn();
          const { getByText } = renderSearchResultList({
            items,
            isMultiSelect,
            onRecordChosen,
            searchType,
            totalCount,
          });

          fireEvent.click(getByText('row button'));

          expect(onRecordChosen).toHaveBeenCalled();
        });
      });

      it('should render with no axe errors', async () => {
        const { container } = renderSearchResultList({
          items,
          isMultiSelect,
          searchType,
          totalCount,
        });

        await runAxeTest({
          rootNode: container,
        });
      });
    });
  });
});
