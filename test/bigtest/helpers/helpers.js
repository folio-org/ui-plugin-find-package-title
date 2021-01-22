import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import {
  withModules,
  clearModules,
} from '@folio/stripes-core/test/bigtest/helpers/stripes-config';
import { beforeEach } from '@bigtest/mocha';
import mirageOptions from '../network';
import PluginHarness from './PluginHarness';

export default function setupApplication({
  scenarios,
  hasAllPerms = true,
} = {}) {
  setupStripesCore({
    mirageOptions: {
      serverType: 'miragejs',
      ...mirageOptions
    },
    scenarios,
    stripesConfig: { hasAllPerms },

    // setup a dummy app for the plugin that renders a harness.
    modules: [{
      type: 'app',
      name: '@folio/ui-dummy',
      displayName: 'dummy.title',
      route: '/dummy',
      module: PluginHarness,
    }],

    translations: {
      'dummy.title': 'Dummy'
    },
  });

  beforeEach(function () {
    this.visit('/dummy');
  });
}

// replace the dummy app to mount the component
export function mount(component) {
  clearModules();

  withModules([{
    type: 'app',
    name: '@folio/ui-dummy',
    displayName: 'dummy.title',
    route: '/dummy',
    module: () => component
  }]);
}

const warn = console.warn;
const blacklist = [
  /componentWillReceiveProps has been renamed/,
  /componentWillUpdate has been renamed/,
  /componentWillMount has been renamed/,
];

const error = console.error;
const errorBlacklist = [
  /React Intl/,
  /@formatjs\//
];

export function turnOffWarnings() {
  // eslint-disable-next-line no-console
  console.warn = function (...args) {
    if (blacklist.some(rx => rx.test(args[0]))) {
      return;
    }
    warn.apply(console, args);
  };

  // eslint-disable-next-line no-console
  console.error = function (...args) {
    if (errorBlacklist.some(rx => rx.test(args[0]))) {
      return;
    }
    error.apply(console, args);
  };
}
