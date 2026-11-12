import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import omit from 'lodash/omit';

import {
  Accordion,
  FilterAccordionHeader,
  RadioButton,
  Select,
  Selection,
} from '@folio/stripes/components';

import { searchFiltersShape } from '../../constants';

import styles from './SearchFilters.css';

export default function SearchFilters({
  activeFilters = {},
  availableFilters,
  onChange,
  disabled,
}) {
  const { formatMessage } = useIntl();

  const toDataOptions = options => options.map(({ labelId, options: groupOptions, ...option }) => ({
    ...option,
    label: formatMessage({ id: labelId }),
    ...(groupOptions && { options: toDataOptions(groupOptions) }),
  }));

  const flattenOptions = options => options.flatMap(option => option.options ?? [option]);

  const getOptionsState = (dataOptions, filters) => {
    const leaves = flattenOptions(dataOptions);
    const ownedKeys = [...new Set(leaves.flatMap(({ filters: optionFilters = {} }) => Object.keys(optionFilters)))];
    const matched = leaves.find(option => ownedKeys.every(key => option.filters?.[key] === filters[key]));
    const current = matched ?? leaves.find(({ isDefault }) => isDefault) ?? {};
    const hasUnmatchedFilters = !matched && ownedKeys.some(key => filters[key] !== undefined);

    return {
      current,
      leaves,
      ownedKeys,
      hasSelectedOption: !current.isDefault || hasUnmatchedFilters,
    };
  };

  const filterOptionsByContains = (filterValue, dataOptions = []) => {
    const needle = filterValue.toLowerCase();
    const matches = ({ label }) => label.toLowerCase().includes(needle);

    return dataOptions.reduce((result, option) => {
      if (!option.options) {
        return matches(option) ? [...result, option] : result;
      }

      const filteredOptions = matches(option)
        ? option.options
        : option.options.filter(matches);

      return filteredOptions.length ? [...result, { ...option, options: filteredOptions }] : result;
    }, []);
  };

  const resetFilter = filterName => () => {
    onChange({
      ...activeFilters,
      [filterName]: undefined,
    });
  };

  const renderOptionsFilter = ({ type, name, label, filterLabelId, options }) => {
    const accordionLabelId = `filter-${name}-label`;
    const dataOptions = toDataOptions(options);
    const {
      current,
      leaves,
      ownedKeys,
      hasSelectedOption,
    } = getOptionsState(dataOptions, activeFilters);

    const clearFilter = () => onChange(omit(activeFilters, ownedKeys));
    const selectOption = selection => {
      const value = type === 'select' ? selection.target.value : selection;
      const selectedOption = leaves.find(option => option.value === value);

      if (!selectedOption) return;

      onChange({
        ...omit(activeFilters, ownedKeys),
        ...(selectedOption.isDefault ? {} : selectedOption.filters),
      });
    };
    const FilterComponent = type === 'select' ? Select : Selection;
    const filterComponentProps = type === 'select'
      ? {
        'aria-label': formatMessage({ id: filterLabelId }),
        'data-testid': `filter-${name}-select`,
      }
      : {
        onFilter: filterOptionsByContains,
      };
    const filterComponent = (
      <FilterComponent
        dataOptions={dataOptions}
        disabled={disabled}
        value={current.value}
        onChange={selectOption}
        marginBottom0
        {...filterComponentProps}
      />
    );

    return (
      <Accordion
        key={name}
        name={name}
        label={type === 'selection' ? <span id={accordionLabelId}>{label}</span> : label}
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={hasSelectedOption}
        onClearFilter={clearFilter}
        id={`filter-${name}`}
      >
        {type === 'selection' ? (
          <fieldset className={styles.selectionFilterGroup} aria-labelledby={accordionLabelId}>
            {filterComponent}
          </fieldset>
        ) : filterComponent}
      </Accordion>
    );
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

  const renderFilter = filter => {
    if (filter.type === 'selection' || filter.type === 'select') {
      return renderOptionsFilter(filter);
    }

    const { name, label, defaultValue, options } = filter;
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
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterLabelId: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
