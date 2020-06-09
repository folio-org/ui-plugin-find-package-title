import { interactor, isPresent } from '@bigtest/interactor';

@interactor class ApplicationInteractor {
  static defaultScope = '#ModuleContainer';
  pluginNotFound = isPresent('[data-test-no-plugin-available]');
}

export default ApplicationInteractor;
