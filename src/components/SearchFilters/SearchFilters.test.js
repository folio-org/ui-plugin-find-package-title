import noop from 'lodash/noop';

import { fireEvent, render } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { searchFiltersConfig, searchTypes } from '../../constants';
import SearchFilters from './SearchFilters';

const renderSearchFilters = (onChange = noop) => render(
  <SearchFilters
    activeFilters={{}}
    availableFilters={[{
      label: <span>label1</span>,
      name: 'name1',
      options: [{
        label: <span>opt1</span>,
        value: 'opt1',
      }, {
        label: <span>opt2</span>,
        value: 'opt2',
      }]
    }]}
    disabled={false}
    onChange={onChange}
  />
);

describe('Given SearchFilters', () => {
  it('should render with no axe errors', async () => {
    const {
      container,
    } = renderSearchFilters();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should show correct accordion', () => {
    const { getByTestId } = renderSearchFilters();

    expect(getByTestId('filter-name1')).toBeDefined();
  });

  it('should show correct radio buttons', () => {
    const { getByTestId } = renderSearchFilters();

    expect(getByTestId('filter-name1-opt1')).toBeDefined();
    expect(getByTestId('filter-name1-opt2')).toBeDefined();
  });

  it('should render and apply grouped Selection status options', () => {
    const onChange = jest.fn();
    const { getByRole, getAllByRole, container } = render(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][1]]}
        disabled={false}
        onChange={onChange}
      />
    );

    expect(container.querySelector('fieldset[aria-labelledby="filter-selected-label"]')).toBeInTheDocument();

    fireEvent.click(container.querySelector('#accordion-toggle-button-filter-selected'));
    fireEvent.click(getByRole('button', { name: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus.all' }));
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getAllByRole('option').find(option => option.textContent.endsWith('.hiddenPF')));

    expect(onChange).toHaveBeenCalledWith({ selected: 'true', visibility: 'hiddenInPF' });
  });

  it('should render and apply Content type Selection options', () => {
    const onChange = jest.fn();
    const { getByRole, getAllByRole, container } = render(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][2]]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(container.querySelector('#accordion-toggle-button-filter-type'));
    fireEvent.click(getByRole('button', { name: 'ui-plugin-find-package-title.searchPane.filters.contentType.all' }));
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getAllByRole('option').find(option => option.textContent.endsWith('.ebook')));

    expect(onChange).toHaveBeenCalledWith({ type: 'ebook' });
  });

  it('should render and apply Package access radio options', () => {
    const onChange = jest.fn();
    const { getByTestId, getByRole } = render(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][3]]}
        disabled={false}
        onChange={onChange}
      />
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getByTestId('filter-access-all')).toBeInTheDocument();
    expect(getByTestId('filter-access-public')).toBeInTheDocument();
    expect(getByTestId('filter-access-controlled')).toBeInTheDocument();

    fireEvent.click(getByTestId('filter-access-controlled'));
    expect(onChange).toHaveBeenCalledWith({ access: 'controlled' });
  });
});
