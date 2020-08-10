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
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor'; // eslint-disable-line

@interactor class SearchField {
  isFocused = is(':focus');
  fill = fillable();
  value = value();
  isEnabled = is(':not([disabled])');
}

@interactor class PluginModalInteractor {
  clickNotSelectedFilter = clickable('#filter-selected-false');
  clickSelectedFilter = clickable('#filter-selected-true');

  resultsItems = collection('[role="group"] [role="row"]', {
    click: clickable(),
    cells: collection('[class^="mclCell--]', {
      text: text()
    }),
  });

  switchToTitleSearch = clickable('[data-test-search-type-button="title"]');
  switchToPackageSearch = clickable('[data-test-search-type-button="package"]');

  isTitleSearchActive = property('[data-test-search-type-button="title"]', 'class');
  isPackageSearchActive = property('[data-test-search-type-button="package"]', 'class');

  searchIndexSelectDisplayed = isPresent('[data-test-search-field-select]');
  searchIndexSelect = new SelectInteractor('[data-test-search-field-select]');

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
  titlesSelectedText = text('[data-test-titles-selected-count]');
  cancelSelection = clickable('[data-test-find-package-title-cancel]');
  saveSelection = clickable('[data-test-find-package-title-save]');
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
