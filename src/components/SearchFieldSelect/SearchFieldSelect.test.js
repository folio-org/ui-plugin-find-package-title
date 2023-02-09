import noop from 'lodash/noop';

import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchFieldSelect from './SearchFieldSelect';
import {
  titleSearchFields,
  titleSearchFieldsTranslationIDs,
} from '../../constants';

const renderSearchFieldSelect = (onChange = noop) => render(
  <SearchFieldSelect
    value={titleSearchFields.TITLE}
    onChange={onChange}
  />
);

describe('Given Search Field Select', () => {
  afterEach(cleanup);

  it('should render with no axe errors', async () => {
    const {
      container,
    } = renderSearchFieldSelect();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should show all options', () => {
    const { getByText } = renderSearchFieldSelect();

    Object.values(titleSearchFieldsTranslationIDs).forEach(id => {
      expect(getByText(id)).toBeDefined();
    });
  });

  describe('when change option', () => {
    it('should handle onChange', () => {
      const onChange = jest.fn();
      const { getByTestId } = renderSearchFieldSelect(onChange);

      fireEvent.change(getByTestId('select-field'), { target: { value: titleSearchFields.PUBLISHER } });

      expect(onChange).toHaveBeenCalledWith(titleSearchFields.PUBLISHER);
    });
  });
});
