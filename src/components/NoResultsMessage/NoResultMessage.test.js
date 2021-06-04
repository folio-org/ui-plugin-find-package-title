import { render } from '@testing-library/react';

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
});
