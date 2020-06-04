import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { turnOffWarnings } from './helpers/helpers';

turnOffWarnings();
const requireTest = require.context('./tests/', true, /-test/);
requireTest.keys().forEach(requireTest);
