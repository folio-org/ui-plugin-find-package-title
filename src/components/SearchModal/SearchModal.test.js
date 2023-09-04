import noop from 'lodash/noop';

import {
  cleanup,
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
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

  const mutator = {
    packages: {
      GET: jest.fn(),
      reset: jest.fn(),
    },
    titles: {
      GET: jest.fn(),
      reset: jest.fn(),
    },
  };
  const resources = { packages };
  const props = {
    mutator,
    resources,
  };

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

    it('should render with no axe errors', async () => {
      const {
        container
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

      await runAxeTest({
        rootNode: container,
      });
    });
  });

  describe('when data was not loaded', () => {
    it('should not show loading message', () => {
      const { queryByText } = renderSearchModal({
        ...props,
        resources: {
          packages: {
            ...packages,
            hasLoaded: false,
            isPending: false,
          },
        },
      });

      expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount.loading')).not.toBeInTheDocument();
    });

    it('should render with no axe errors', async () => {
      const { container } = renderSearchModal({
        ...props,
        resources: {
          packages: {
            ...packages,
            hasLoaded: false,
            isPending: false,
          },
        },
      });

      await runAxeTest({
        rootNode: container,
      });
    });
  });

  describe('when data was loaded', () => {
    it('should show search modal', () => {
      const { getByTestId } = renderSearchModal(props);

      expect(getByTestId('find-package-title-modal')).toBeDefined();
    });

    it('should render with no axe errors', async () => {
      const { container } = renderSearchModal(props);

      await runAxeTest({
        rootNode: container,
      });
    });

    describe('when modal is multiselect', () => {
      it('should show search modal footer', () => {
        const { getByTestId } = renderSearchModal({
          ...props,
          isMultiSelect: true,
        });

        expect(getByTestId('modal-footer')).toBeDefined();
      });

      it('should render with no axe errors', async () => {
        const { container } = renderSearchModal({
          ...props,
          isMultiSelect: true,
        });

        await runAxeTest({
          rootNode: container,
        });
      });
    });

    describe('when modal is singleselect', () => {
      it('should do not show search modal footer', () => {
        const { queryByTestId } = renderSearchModal(props);

        expect(queryByTestId('modal-footer')).not.toBeInTheDocument();
      });
    });

    describe('when search type is package', () => {
      it('should show sub header', () => {
        const {
          getByText,
          queryByText,
        } = renderSearchModal(props);

        expect(getByText('ui-plugin-find-package-title.resultsPane.resultsCount')).toBeDefined();
        expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount.loading')).not.toBeInTheDocument();
      });

      describe('when click on reset filters button', () => {
        it('should reset filters', () => {
          const {
            getByTestId,
            getByPlaceholderText,
          } = renderSearchModal(props);

          const searchField = getByPlaceholderText('ui-plugin-find-package-title.searchableEntity.package');

          expect(searchField).not.toBeNull();

          fireEvent.change(searchField, { target: { value: 'a' } });
          fireEvent.click(getByTestId('reset-button'));

          expect(mutator.packages.reset).toHaveBeenCalled();
        });
      });

      describe('when click on submit button', () => {
        it('should handle get packages action', () => {
          const {
            getByTestId,
            getByPlaceholderText,
          } = renderSearchModal(props);

          const searchField = getByPlaceholderText('ui-plugin-find-package-title.searchableEntity.package');

          fireEvent.change(searchField, { target: { value: 'a' } });
          fireEvent.click(getByTestId('find-package-title-search-button'));

          expect(mutator.packages.GET).toHaveBeenCalled();
        });
      });
    });

    describe('when search type is title', () => {
      it('should not show sub header', () => {
        const {
          getByTestId,
          queryByText,
        } = renderSearchModal(props);

        fireEvent.click(getByTestId('title-search-type-button'));

        expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount')).not.toBeInTheDocument();
        expect(queryByText('ui-plugin-find-package-title.resultsPane.resultsCount.loading')).not.toBeInTheDocument();
      });

      it('should render with no axe errors', async () => {
        const {
          container,
          getByTestId
        } = renderSearchModal(props);

        fireEvent.click(getByTestId('title-search-type-button'));

        await runAxeTest({
          rootNode: container,
        });
      });

      describe('when click on reset filters button', () => {
        it('should reset filters', () => {
          const {
            getByTestId,
            getByPlaceholderText,
          } = renderSearchModal(props);

          fireEvent.click(getByTestId('title-search-type-button'));

          const searchField = getByPlaceholderText('ui-plugin-find-package-title.searchableEntity.title');

          fireEvent.change(searchField, { target: { value: 'a' } });
          fireEvent.click(getByTestId('reset-button'));

          expect(mutator.titles.reset).toHaveBeenCalled();
        });
      });

      describe('when click on submit button', () => {
        it('should handle get packages action', () => {
          const {
            getByTestId,
            getByPlaceholderText,
          } = renderSearchModal(props);

          fireEvent.click(getByTestId('title-search-type-button'));

          const searchField = getByPlaceholderText('ui-plugin-find-package-title.searchableEntity.title');

          fireEvent.change(searchField, { target: { value: 'a' } });
          fireEvent.click(getByTestId('find-package-title-search-button'));

          expect(mutator.titles.GET).toHaveBeenCalled();
        });
      });
    });

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

      it('should render with no axe errors', async () => {
        const { container } = renderSearchModal({
          ...props,
          resources: {
            ...resources,
            tags,
          },
        });

        await runAxeTest({
          rootNode: container,
        });
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

      it('should render with no axe errors', async () => {
        const { container } = renderSearchModal({
          ...props,
          resources: {
            ...resources,
            accessTypes,
          },
        });

        await runAxeTest({
          rootNode: container,
        });
      });
    });

    describe('when click on close modal button', () => {
      it('should handle onClose', () => {
        const onClose = jest.fn();
        const { getByText } = renderSearchModal({
          ...props,
          onClose,
        });

        fireEvent.click(getByText('times'));

        expect(mutator.packages.reset).toHaveBeenCalled();
        expect(mutator.titles.reset).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
