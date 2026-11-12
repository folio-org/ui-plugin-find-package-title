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
  type: 'selection',
  name: 'selected',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.selectionStatus" />,
  defaultValue: 'all',
  options: [
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus',
      options: [
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus.all',
          value: 'all',
          filters: {},
          isDefault: true,
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus.selected',
          value: 'selected',
          filters: { selected: 'true' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus.notSelected',
          value: 'notSelected',
          filters: { selected: 'false' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.selectionStatus.orderedThrough',
          value: 'orderedThrough',
          filters: { selected: 'ebsco' },
        },
      ],
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.visibilityStatus',
      options: [
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.visibleSomewhere',
          value: 'visibleSomewhere',
          filters: { selected: 'true', visibility: 'visibleSomewhere' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.hiddenSomewhere',
          value: 'hiddenSomewhere',
          filters: { selected: 'true', visibility: 'hiddenSomewhere' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.hiddenPF',
          value: 'hiddenPF',
          filters: { selected: 'true', visibility: 'hiddenInPF' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.hiddenFTF',
          value: 'hiddenFTF',
          filters: { selected: 'true', visibility: 'hiddenInFTF' },
        },
        {
          labelId: 'ui-plugin-find-package-title.searchPane.filters.hiddenMARC',
          value: 'hiddenMARC',
          filters: { selected: 'true', visibility: 'hiddenInMARC' },
        },
      ],
    },
  ]
};

const contentTypeFilterConfig = {
  type: 'select',
  name: 'type',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.contentType" />,
  filterLabelId: 'ui-plugin-find-package-title.searchPane.filters.contentType',
  defaultValue: 'all',
  options: [
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.all',
      value: 'all',
      filters: {},
      isDefault: true,
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.aggregated',
      value: 'aggregatedfulltext',
      filters: { type: 'aggregatedfulltext' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.abstract',
      value: 'abstractandindex',
      filters: { type: 'abstractandindex' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.ebook',
      value: 'ebook',
      filters: { type: 'ebook' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.ejournal',
      value: 'ejournal',
      filters: { type: 'ejournal' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.mixedContent',
      value: 'mixedcontent',
      filters: { type: 'mixedcontent' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.onlineRef',
      value: 'onlinereference',
      filters: { type: 'onlinereference' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.print',
      value: 'print',
      filters: { type: 'print' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.streamingMedia',
      value: 'streamingmedia',
      filters: { type: 'streamingmedia' },
    },
    {
      labelId: 'ui-plugin-find-package-title.searchPane.filters.contentType.unknown',
      value: 'unknown',
      filters: { type: 'unknown' },
    },
  ]
};

const packageAccessFilterConfig = {
  name: 'access',
  label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.packageAccess" />,
  defaultValue: 'all',
  options: [
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.packageAccess.all" />, value: 'all' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.packageAccess.public" />, value: 'public' },
    { label: <FormattedMessage id="ui-plugin-find-package-title.searchPane.filters.packageAccess.controlled" />, value: 'controlled' },
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
  packageAccessFilterConfig,
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
