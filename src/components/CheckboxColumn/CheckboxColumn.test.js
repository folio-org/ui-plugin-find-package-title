import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import CheckboxColumn from './CheckboxColumn';

const renderCheckboxColumn = onChange => render(
  <CheckboxColumn
    value="test"
    onChange={onChange}
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
});
