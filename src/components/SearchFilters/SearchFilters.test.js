import noop from 'lodash/noop';

import { render } from '@testing-library/react';

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
  it('should show correct accordion', () => {
    const { getByTestId } = renderSearchFilters();

    expect(getByTestId('filter-name1')).toBeDefined();
  });

  it('should show correct radio buttons', () => {
    const { getByTestId } = renderSearchFilters();

    expect(getByTestId('filter-name1-opt1')).toBeDefined();
    expect(getByTestId('filter-name1-opt2')).toBeDefined();
  });
});
