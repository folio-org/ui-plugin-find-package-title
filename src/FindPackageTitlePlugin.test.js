import noop from 'lodash/noop';

import {
  cleanup,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
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

    it('should render with no axe errors', async () => {
      const { container } = renderFindPackageTitlePlugin();

      await runAxeTest({
        rootNode: container,
      });
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
