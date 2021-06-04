import noop from 'lodash/noop';

import {
  cleanup,
  render,
} from '@testing-library/react';

import FindPackageTitlePlugin from './FindPackageTitlePlugin';

jest.mock('./components', () => ({
  SearchModal: jest.fn(() => <span>SearchModal</span>),
}));

const renderFindPackageTitlePlugin = (renderCustomTrigger) => render(
  <FindPackageTitlePlugin
    isMultiSelect={false}
    onRecordChosen={noop}
    renderCustomTrigger={renderCustomTrigger}
  />
);

describe('Given FindPackageTitlePlugin', () => {
  afterEach(cleanup);

  describe('when component does not get renderCustomTrigger action', () => {
    it('should render default trigger', () => {
      const { getByTestId } = renderFindPackageTitlePlugin();

      expect(getByTestId('default-trigger')).toBeDefined();
    });
  });

  describe('when component get renderCustomTrigger action', () => {
    it('should handle renderCustomTrigger', () => {
      const renderCustomTrigger = jest.fn();

      renderFindPackageTitlePlugin(renderCustomTrigger);

      expect(renderCustomTrigger).toHaveBeenCalled();
    });
  });
});
