import PropTypes from 'prop-types';

const searchFiltersShape = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]));

export default searchFiltersShape;
