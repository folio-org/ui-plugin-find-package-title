import PropTypes from 'prop-types';

export const packageAttributesFields = {
  contentType: PropTypes.string.isRequired,
  customCoverage: PropTypes.shape({
    beginCoverage: PropTypes.string.isRequired,
    endCoverage: PropTypes.string.isRequired,
  }).isRequired,
  isCustom: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  packageId: PropTypes.number.isRequired,
  packageType: PropTypes.string.isRequired,
  providerId: PropTypes.number.isRequired,
  providerName: PropTypes.string.isRequired,
  selectedCount: PropTypes.number.isRequired,
  titleCount: PropTypes.number.isRequired,
  visibilityData: PropTypes.shape({
    isHidden: PropTypes.bool.isRequired,
    reason: PropTypes.string.isRequired,
  }).isRequired,
};

export const packageResponseShape = PropTypes.shape({
  attributes: PropTypes.shape(packageAttributesFields).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}).isRequired;
