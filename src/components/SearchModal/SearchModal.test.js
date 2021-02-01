import React from 'react';
import noop from 'lodash/noop';

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import SearchModal from './SearchModal';

jest.mock('../SearchFieldSelect', () => jest.fn(() => <span>SearchFieldSelect</span>));

const renderSearchModal = ({
  open = true,
  onRecordChosen = noop,
  onClose = noop,
  mutator,
  resources,
  isMultiSelect = false,
}) => render(
  <SearchModal
    open={open}
    onRecordChosen={onRecordChosen}
    onClose={onClose}
    mutator={mutator}
    resources={resources}
    isMultiSelect={isMultiSelect}
  />
);

const packages = {
  hasLoaded: true,
  isPending: false,
  records: [{
    data: [{
      id: '1075-7600',
      type: 'packages',
      attributes: {
        contentType: 'Online Reference',
        customCoverage: {
          beginCoverage: '',
          endCoverage: ''
        },
        isCustom: false,
        isSelected: false,
        name: 'EBSCO 2',
        packageId: 7698,
        packageType: 'Complete',
        providerId: 1075,
        providerName: 'ABC Chemistry',
        selectedCount: 0,
        titleCount: 1,
        visibilityData: {
          isHidden: false,
          reason: ''
        }
      },
    }],
    meta: {
      totalResults: 1,
    },
  }],
};

const tags = {
  hasLoaded: true,
  records: [{
    tags: [{
      id: 'tag-id1',
      label: 'tag-label1',
    }, {
      id: 'tag-id2',
      label: 'tag-label2',
    }],
  }],
};

const accessTypes = {
  hasLoaded: true,
  records: [{
    data: [{
      attributes: {
        name: 'access type',
      },
    }],
  }],
};

describe('Given SearchModal', () => {
  afterEach(cleanup);

  let mutator;

  const resources = { packages };

  const props = {
    mutator,
    resources,
  };

  beforeEach(() => {
    mutator = {
      packages: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
      titles: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };
  });

  describe('when data onload', () => {
    it('should show loading message', () => {
      const {
        getByText,
        queryByText,
      } = renderSearchModal({
        ...props,
        resources: {
          packages: {
            ...packages,
            hasLoaded: false,
            isPending: true,
          },
        },
      });

      expect(getByText('ui-plugin-find-package-title.resultsPane.resultsCount.loading')).toBeDefined();
      expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount')).not.toBeInTheDocument();
    });
  });

  describe('when data was loaded', () => {
    it('should show search modal', () => {
      const { getByTestId } = renderSearchModal(props);

      expect(getByTestId('find-package-title-modal')).toBeDefined();
    });

    it('should show sub header', () => {
      const {
        getByText,
        queryByText,
      } = renderSearchModal(props);

      expect(getByText('ui-plugin-find-package-title.resultsPane.resultsCount')).toBeDefined();
      expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount.loading')).not.toBeInTheDocument();
    });

    describe('when modal is multiselect', () => {
      it('should show search modal footer', () => {
        const { getByTestId } = renderSearchModal({
          ...props,
          isMultiSelect: true,
        });

        expect(getByTestId('modal-footer')).toBeDefined();
      });
    });

    describe('when modal is singleselect', () => {
      it('should do not show search modal footer', () => {
        const { queryByTestId } = renderSearchModal(props);

        expect(queryByTestId('modal-footer')).not.toBeInTheDocument();
      });
    });

    /*
    describe('when click on close modal button', () => {
      it('should handle onClose', () => {
        const onClose = jest.fn();
        const { container } = renderSearchModal({
          mutator,
          onClose,
          resources,
        });

        const closeModalButton = container.querySelector('[id="find-package-title-modal-close-button"]');

        fireEvent.click(closeModalButton);

        expect(onClose).toHaveBeenCalled();
      });
    });
    */

    describe('when tags exist', () => {
      it('should render tags filter', () => {
        const { getByTestId } = renderSearchModal({
          ...props,
          resources: {
            ...resources,
            tags,
          },
        });

        expect(getByTestId('tags-filter')).toBeDefined();
      });
    });

    describe('when access type exist', () => {
      it('should render access type filter', () => {
        const { getByTestId } = renderSearchModal({
          ...props,
          resources: {
            ...resources,
            accessTypes,
          },
        });

        expect(getByTestId('access-type-filter')).toBeDefined();
      });
    });

    describe('when click on reset filters button', () => {
      it('should reset filters', () => {
        const {
          getByTestId,
          getByPlaceholderText,
        } = renderSearchModal(props);

        const searchField = getByPlaceholderText('ui-plugin-find-package-title.searchableEntity.package');

        fireEvent.change(searchField, { target: { value: 'a' } });
        fireEvent.click(getByTestId('reset-button'));

        expect(mutator.packages.reset).toHaveBeenCalled();
      });
    });

    /*
    it('should get', async () => {
      mutator.packages.GET.mockReturnValue(Promise.resolve(resources));

      await act(async () => {
        renderSearchModal(props);
      });

      expect(mutator.packages.GET).toHaveBeenCalled();
    });

    it('should handle onSearchTypeChange after click on title button', () => {
      const { getByTestId } = renderSearchModal(props);

      fireEvent.click(getByTestId('title-search-type-button'));

      expect(mutator.titles.GET).toHaveBeenCalled();
    });
    */
  });
});
