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
  return (
    <div className={styles['search-filters']} data-test-eholdings-search-filters>
      {availableFilters.map(({ name, label, defaultValue, options }) => {
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
            onClearFilter={() => onChange({ ...activeFilters, [name]: undefined })}
            id={`filter-${name}`}
          >
            <div
              role="radiogroup"
              aria-labelledby={accordionLabelId}
            >
              {options.map(({ label: radioBtnLabel, value }, i) => {
                const isChecked = value === (activeFilters[name] || defaultValue);

                return (
                  <RadioButton
                    role="radio"
                    aria-checked={isChecked}
                    tabIndex={isChecked ? 0 : -1}
                    key={i}
                    name={name}
                    id={`eholdings-search-filters-${name}-${value}`}
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
              })}
            </div>
          </Accordion>
        );
      })}
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
