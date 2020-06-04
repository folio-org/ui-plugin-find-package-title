import {
  interactor,
  scoped,
  collection,
  clickable,
  fillable,
  is,
  isPresent,
  text,
  value,
  property,
} from '@bigtest/interactor';

import MCLInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor'; // eslint-disable-line
import MultiSelectInteractor from '@folio/stripes-components/lib/MultiSelection/tests/interactor'; // eslint-disable-line

@interactor class SearchField {
  isFocused = is(':focus');
  fill = fillable();
  value = value();
  isEnabled = is(':not([disabled])');
}

@interactor class PluginModalInteractor {
  clickNotSelectedFilter = clickable('#filter-selected-false');

  resultsItems = collection('[role="group"] [role="row"]', {
    click: clickable(),
    cells: collection('[class^="mclCell--]', {
      text: text()
    }),
  });

  resultsList = new MCLInteractor();

  resetButton = scoped('[data-test-find-package-title-reset-button]', {
    isEnabled: is(':not([disabled])'),
    click: clickable()
  });

  tagsFilterSelect = new MultiSelectInteractor('#tags-filter');
  accessTypesFilterSelect = new MultiSelectInteractor('#access-types-filter');

  toggleSearchByTags = clickable('[data-test-toggle-search-by-tags]');
  toggleSearchByAccessTypes = clickable('[data-test-toggle-search-by-access-types]');
  searchByTagsDisabled = property('#tags-filter-input', 'disabled');
  searchByAccessTypesDisabled = property('#access-types-filter-input', 'disabled');
  searchField = scoped('[data-test-find-package-title-search-field]', SearchField);
  searchButton = scoped('[data-test-find-package-title-search-button]', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  noResultsDisplayed = isPresent('[data-test-no-results-message]');
  searchPromptDisplayed = isPresent('[data-test-search-prompt]');
}

@interactor class PluginInteractor {
  defaultTriggerIsDisplayed = isPresent('[data-test-find-package-title-trigger]');
  triggerButton = scoped('[data-test-find-package-title-trigger]', {
    click: clickable(),
  });

  customTriggerIsDisplayed = isPresent('[data-test-custom-trigger]');

  modalIsDisplayed = isPresent('#find-package-title-modal');
  modal = new PluginModalInteractor('#find-package-title-modal');
}

export default PluginInteractor;
