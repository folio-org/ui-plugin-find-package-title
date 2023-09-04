import {
  cleanup,
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import ResetButton from './ResetButton';

const renderResetButton = (onClick) => render(
  <ResetButton
    id="testId"
    onClick={onClick}
  />
);

describe('Given ResetButton', () => {
  afterEach(cleanup);

  it('should render with no axe errors', async () => {
    const {
      container,
    } = renderResetButton();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when click on reset button', () => {
    it('should handle onClick', () => {
      const onClick = jest.fn();
      const { getByTestId } = renderResetButton(onClick);

      fireEvent.click(getByTestId('reset-button'));

      expect(onClick).toHaveBeenCalled();
    });
  });
});
