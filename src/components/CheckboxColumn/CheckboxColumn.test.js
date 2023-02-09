import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import CheckboxColumn from './CheckboxColumn';

const renderCheckboxColumn = (onChange) => render(
  <CheckboxColumn
    value="test"
    onChange={onChange}
    ariaLabel="test area label"
  />
);

describe('Given CheckboxColumn', () => {
  afterEach(cleanup);

  describe('when click on checkbox', () => {
    it('should handle onChange', () => {
      const onChange = jest.fn();
      const { getByTestId } = renderCheckboxColumn(onChange);

      fireEvent.click(getByTestId('checkbox-column'));

      expect(onChange).toHaveBeenCalled();
    });
  });


  it('should render with no axe errors', async () => {
    const {
      container,
    } = renderCheckboxColumn();

    await runAxeTest({
      rootNode: container,
    });
  });
});
