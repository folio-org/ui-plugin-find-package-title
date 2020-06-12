import React from 'react';
import noop from 'lodash/noop';
import { Pluggable } from '@folio/stripes/core';

const PluginHarness = props => {
  return (
    <Pluggable
      type="find-package-title"
      onRecordChosen={noop}
      {...props}
    />
  );
};

export default PluginHarness;
