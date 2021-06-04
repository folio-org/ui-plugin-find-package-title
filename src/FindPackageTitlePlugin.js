import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { SearchModal } from './components';

const propTypes = {
  isMultiSelect: PropTypes.bool,
  onRecordChosen: PropTypes.func.isRequired,
  renderCustomTrigger: PropTypes.func,
};

const FindPackageTitlePlugin = ({
  onRecordChosen,
  renderCustomTrigger,
  isMultiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPluginModal = () => { setIsOpen(true); };
  const closePluginModal = () => { setIsOpen(false); };

  const renderDefaultTrigger = () => {
    return (
      <Button
        data-testid="default-trigger"
        onClick={openPluginModal}
      >
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
        isMultiSelect={isMultiSelect}
      />
    </>
  );
};

FindPackageTitlePlugin.propTypes = propTypes;

export default FindPackageTitlePlugin;
