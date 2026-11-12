import noop from 'lodash/noop';

import {
  fireEvent,
  render,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

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

const selectionFilter = {
  type: 'selection',
  label: <span>grouped label</span>,
  name: 'grouped',
  options: [{
    labelId: 'group.one',
    options: [{
      labelId: 'option.all',
      value: 'all',
      filters: {},
      isDefault: true,
    }, {
      labelId: 'option.match',
      value: 'match',
      filters: { first: 'yes' },
    }, {
      labelId: 'option.other',
      value: 'other',
      filters: { first: 'no' },
    }],
  }, {
    labelId: 'group.two',
    options: [{
      labelId: 'option.third',
      value: 'third',
      filters: { second: 'yes' },
    }],
  }],
};

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

  it('should render and apply Content type Select options', () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole, container } = render(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][2]]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(container.querySelector('#accordion-toggle-button-filter-type'));
    expect(getByTestId('filter-type-select').tagName).toBe('SELECT');
    expect(getByTestId('filter-type-select').value).toBe('all');
    expect(getAllByRole('option')).toHaveLength(10);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('filter-type-select'), { target: { value: 'ebook' } });

    expect(onChange).toHaveBeenCalledWith({ type: 'ebook' });
  });

  it('should show an active Content type and clear its selection', () => {
    const onChange = jest.fn();
    const { getByTestId, rerender, container } = render(
      <SearchFilters
        activeFilters={{ type: 'ebook' }}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][2]]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(container.querySelector('#accordion-toggle-button-filter-type'));

    expect(getByTestId('filter-type-select').value).toBe('ebook');

    fireEvent.change(getByTestId('filter-type-select'), { target: { value: 'all' } });

    expect(onChange).toHaveBeenCalledWith({});

    rerender(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][2]]}
        disabled={false}
        onChange={onChange}
      />
    );

    expect(getByTestId('filter-type-select').value).toBe('all');
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

  it('should clear a radio filter while preserving other active filters', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SearchFilters
        activeFilters={{ access: 'controlled', other: 'value' }}
        availableFilters={[searchFiltersConfig[searchTypes.PACKAGE][3]]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByRole('button', { name: 'stripes-components.filterGroups.clearFilterSetLabel' }));

    expect(onChange).toHaveBeenCalledWith({ access: undefined, other: 'value' });
  });

  it('should clear all keys owned by a selection filter and preserve unrelated filters', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SearchFilters
        activeFilters={{ first: 'yes', second: 'yes', unrelated: 'value' }}
        availableFilters={[selectionFilter]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByRole('button', { name: 'stripes-components.filterGroups.clearFilterSetLabel' }));

    expect(onChange).toHaveBeenCalledWith({ unrelated: 'value' });
  });

  it('should use the default selection for unmatched active filters and allow clearing it', () => {
    const onChange = jest.fn();
    const filter = {
      ...selectionFilter,
      options: [{
        labelId: 'option.all',
        value: 'all',
        filters: {},
        isDefault: true,
      }, ...selectionFilter.options],
    };
    const { getByRole } = render(
      <SearchFilters
        activeFilters={{ first: 'unknown', unrelated: 'value' }}
        availableFilters={[filter]}
        disabled={false}
        onChange={onChange}
      />
    );

    fireEvent.click(getByRole('button', { name: 'stripes-components.filterGroups.clearFilterSetLabel' }));

    expect(onChange).toHaveBeenCalledWith({ unrelated: 'value' });
  });

  it('should filter nested selection options by their labels case-insensitively', async () => {
    const { getByRole, getAllByRole, container } = render(
      <SearchFilters
        activeFilters={{}}
        availableFilters={[selectionFilter]}
        disabled={false}
        onChange={noop}
      />
    );

    fireEvent.click(container.querySelector('#accordion-toggle-button-filter-grouped'));
    fireEvent.click(getByRole('button', { name: 'option.all' }));
    fireEvent.click(getByRole('combobox'));
    fireEvent.change(getByRole('combobox'), { target: { value: 'GROUP.ONE' } });

    await waitFor(() => {
      const options = getAllByRole('option');

      expect(options.map(option => option.textContent)).toEqual([
        'option.all',
        'option.match',
        'option.other',
      ]);
    });
  });
});
