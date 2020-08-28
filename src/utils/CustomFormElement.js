import React from "react";
import PropTypes from "prop-types";
import CustomFormContext from "./CustomFormContext";
import CustomFormElementComponent from "./CustomFormElementComponent";

const CustomFormElement = props => {
    const {classes, ...elementProps} = props;
    return (
        <CustomFormContext.Consumer>
            {formContext => (
                <CustomFormElementComponent formContext={formContext} {...elementProps} />
            )}
        </CustomFormContext.Consumer>
    );
};

CustomFormElement.propTypes = {
    classes: PropTypes.object,
    valueLink: PropTypes.object.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    hint: PropTypes.object,
    helpText: PropTypes.string,
    validations: PropTypes.array,
    control: PropTypes.object.isRequired
};

CustomFormElement.defaultProps = {
    label: null,
    required: false,
    hint: null,
    helpText: "",
    validations: []
};

export default CustomFormElement;
