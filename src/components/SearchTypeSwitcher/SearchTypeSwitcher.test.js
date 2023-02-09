import noop from 'lodash/noop';

import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import SearchTypeSwitcher from './SearchTypeSwitcher';
import {
  searchTypes,
  searchTypesTranslationIDs,
} from '../../constants';


const renderSearchTypeSwitcher = (onSearchTypeChange = noop) => render(
  <div id="filters-panel">
    <SearchTypeSwitcher
      currentSearchType={searchTypes.PACKAGE}
      onSearchTypeChange={onSearchTypeChange}
    />
  </div>
);

describe('Given SearchTypeSwitcher', () => {
  afterEach(cleanup);

  it('should show all search types buttons', () => {
    const { getByText } = renderSearchTypeSwitcher();

    Object.values(searchTypesTranslationIDs).forEach(id => {
      expect(getByText(id)).toBeDefined();
    });
  });

  it('should have correct attributes for selected button', () => {
    const { getByTestId } = renderSearchTypeSwitcher();

    expect(getByTestId('package-search-type-button')).toHaveAttribute('aria-selected', 'true');
    expect(getByTestId('package-search-type-button')).toHaveClass('primary');
  });

  it('should have correct attributes for not selected button', () => {
    const { getByTestId } = renderSearchTypeSwitcher();

    expect(getByTestId('title-search-type-button')).toHaveAttribute('aria-selected', 'false');
    expect(getByTestId('title-search-type-button')).toHaveClass('default');
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchTypeSwitcher();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when click on title search type button', () => {
    it('should handle onSearchTypeChange', () => {
      const onSearchTypeChange = jest.fn();
      const { getByTestId } = renderSearchTypeSwitcher(onSearchTypeChange);

      fireEvent.click(getByTestId('title-search-type-button'));

      expect(onSearchTypeChange).toHaveBeenCalledWith(searchTypes.TITLE);
    });

    it('should render with no axe errors', async () => {
      const { container } = renderSearchTypeSwitcher();

      await runAxeTest({
        rootNode: container,
      });
    });
  });
});
