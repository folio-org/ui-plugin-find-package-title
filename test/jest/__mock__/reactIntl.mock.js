import React from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => (children ? children(id) : id)),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});
