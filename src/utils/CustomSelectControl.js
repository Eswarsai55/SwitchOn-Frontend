import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Select from "react-select";


const CustomSelectControl = props => {

    const {
        // classes,
        // onBlur,
        valueLink, options, multiple, searchable, onChangeCallback = () => {}
    } = props;

    const filterOptions = (allOptions, filter, currentValues) => {
        return allOptions.filter(
            option =>
                (option.labelString || option.label)
                    .toLowerCase()
                    .indexOf(filter.toLowerCase()) !== -1
        );
    };

    const optionsDict = _.keyBy(options, "value");

    const stateValue = valueLink.value;
    let valueOption = "";

    if (multiple && stateValue.length > 0) {
        valueOption = stateValue.map(value => optionsDict[value]);
    }

    if (!multiple && stateValue) {
        valueOption = optionsDict[stateValue];
    }

    const onChangeInternal = selectedOption => {
        if (multiple) {
            valueLink.requestChange(selectedOption.map(option => option.value));
            onChangeCallback();
        } else {
            valueLink.requestChange(selectedOption ? selectedOption.value : "");
            onChangeCallback();
        }
    };

    return (
        <Select
            isMulti={multiple}
            value={valueOption}
            onChange={onChangeInternal}
            simpleValue={false}
            options={options}
            isClearable={false}
            isSearchable={searchable}
            filterOptions={filterOptions}
        />
    );
};

CustomSelectControl.propTypes = {
    classes: PropTypes.object.isRequired,
    onBlur: PropTypes.func.isRequired,
    valueLink: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    multiple: PropTypes.bool
};

CustomSelectControl.defaultProps = {
    multiple: false
};

export default CustomSelectControl;
