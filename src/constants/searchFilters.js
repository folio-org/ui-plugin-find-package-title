import { FormattedMessage } from 'react-intl';
import searchTypes from './searchTypes';

const baseSortFilterConfig = {
  name: 'sort',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.sortOptions.label" />,
  defaultValue: 'relevance',
};

const packageSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.sortOptions.relevance" />, value: 'relevance' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.sortOptions.package" />, value: 'name' },
  ]
};

const titleSortFilterConfig = {
  ...baseSortFilterConfig,
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.sortOptions.relevance" />, value: 'relevance' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.sortOptions.title" />, value: 'name' },
  ]
};

const selectionStatusFilterConfig = {
  name: 'selected',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.selectionStatus" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.selectionStatus.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.selectionStatus.selected" />, value: 'true' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.selectionStatus.notSelected" />, value: 'false' },
  ]
};

const contentTypeFilterConfig = {
  name: 'type',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.aggregated" />, value: 'aggregatedfulltext' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.abstract" />, value: 'abstractandindex' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.ebook" />, value: 'ebook' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.ejournal" />, value: 'ejournal' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.print" />, value: 'print' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.onlineRef" />, value: 'onlinereference' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType.unknown" />, value: 'unknown' }
  ]
};

const publicationTypeFilterConfig = {
  name: 'type',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.audiobook" />, value: 'audiobook' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.book" />, value: 'book' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.bookSeries" />, value: 'bookseries' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.database" />, value: 'database' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.journal" />, value: 'journal' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.newsletter" />, value: 'newsletter' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.newspaper" />, value: 'newspaper' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.proceedings" />, value: 'proceedings' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.report" />, value: 'report' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.streamingAudio" />, value: 'streamingaudio' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.streamingVideo" />, value: 'streamingvideo' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.thesisAndDissertation" />, value: 'thesisdissertation' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.website" />, value: 'website' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.publicationType.unspecified" />, value: 'unspecified' }
  ]
};

const packageFilters = [
  packageSortFilterConfig,
  selectionStatusFilterConfig,
  contentTypeFilterConfig,
];

const titleFilters = [
  titleSortFilterConfig,
  selectionStatusFilterConfig,
  publicationTypeFilterConfig,
];

const searchFilters = {
  [searchTypes.PACKAGE]: packageFilters,
  [searchTypes.TITLE]: titleFilters,
};

export default searchFilters;
