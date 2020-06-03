import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { SearchModal } from './components';

const propTypes = {
  renderTrigger: PropTypes.func,
  onRecordChosen: PropTypes.func.isRequired,
};

const FindPackageTitlePluginContainer = ({
  onRecordChosen,
  renderCustomTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPluginModal = () => { setIsOpen(true); };
  const closePluginModal = () => { setIsOpen(false); };


  const renderDefaultTrigger = () => {
    return (
      <Button onClick={openPluginModal}>
        <FormattedMessage id="ui-plugin-find-package-title.defaultTriggerLabel" />
      </Button>
    );
  };

  const renderTrigger = () => {
    return renderCustomTrigger
      ? renderCustomTrigger({ onClick: openPluginModal })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTrigger()}
      <SearchModal
        open={isOpen}
        onClose={closePluginModal}
        onRecordChosen={onRecordChosen}
      />
    </>
  );
};

FindPackageTitlePluginContainer.propTypes = propTypes;

export default FindPackageTitlePluginContainer;
