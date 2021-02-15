import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  FilterAccordionHeader,
  RadioButton
} from '@folio/stripes/components';

import { searchFiltersShape } from '../../constants';

import styles from './SearchFilters.css';

export default function SearchFilters({
  activeFilters = {},
  availableFilters,
  onChange,
  disabled,
}) {
  const resetFilter = filterName => () => {
    onChange({
      ...activeFilters,
      [filterName]: undefined,
    });
  };

  const renderFilterOption = filterData => optionData => {
    const { name, defaultValue } = filterData;
    const { label: radioBtnLabel, value } = optionData;

    const isChecked = value === (activeFilters[name] || defaultValue);

    return (
      <RadioButton
        role="radio"
        aria-checked={isChecked}
        tabIndex={isChecked ? 0 : -1}
        key={value}
        name={name}
        id={`filter-${name}-${value}`}
        data-testid={`filter-${name}-${value}`}
        label={radioBtnLabel}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={e => onChange({
          ...activeFilters,
          [name]: e.target.value,
        })}
      />
    );
  };

  const renderFilter = ({ name, label, defaultValue, options }) => {
    const accordionLabelId = `filter-${name}-label`;

    return (
      <Accordion
        key={name}
        name={name}
        label={
          <span id={accordionLabelId}>
            {label}
          </span>
        }
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={!!activeFilters[name] && activeFilters[name] !== defaultValue}
        onClearFilter={resetFilter(name)}
        id={`filter-${name}`}
      >
        <div
          role="radiogroup"
          aria-labelledby={accordionLabelId}
          data-testid={`filter-${name}`}
        >
          {options.map(renderFilterOption({
            name,
            defaultValue,
          }))}
        </div>
      </Accordion>
    );
  };

  return (
    <div className={styles['search-filters']}>
      {availableFilters.map(renderFilter)}
    </div>
  );
}

SearchFilters.propTypes = {
  activeFilters: searchFiltersShape.isRequired,
  availableFilters: PropTypes.arrayOf(PropTypes.shape({
    defaultValue: PropTypes.string,
    label: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  })).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
