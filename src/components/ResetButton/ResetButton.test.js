import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import ResetButton from './ResetButton';

const renderResetButton = onClick => render(
  <ResetButton
    id="testId"
    onClick={onClick}
  />
);

describe('Given ResetButton', () => {
  afterEach(cleanup);

  describe('when click on reset button', () => {
    it('should handle onClick', () => {
      const onClick = jest.fn();
      const { getByTestId } = renderResetButton(onClick);

      fireEvent.click(getByTestId('reset-button'));

      expect(onClick).toHaveBeenCalled();
    });
  });
});
