import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import NoResultsMessage from './NoResultsMessage';

const renderNoResultMessage = (children) => render(
  <NoResultsMessage>
    {children}
  </NoResultsMessage>
);

describe('Given NoResultsMessage', () => {
  it('should display correct message', () => {
    const { getByText } = renderNoResultMessage('no result message');

    expect(getByText('no result message')).toBeDefined();
  });

  it('should render with no axe errors', async () => {
    const {
      container,
    } = renderNoResultMessage('no result message');

    await runAxeTest({
      rootNode: container,
    });
  });
});
