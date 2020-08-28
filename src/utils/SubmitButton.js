import React from "react";
import PropTypes from "prop-types";
import CustomFormContext from "./CustomFormContext";
import FormSubmitButtonComponent from "./SubmitButtonComponent";

const SubmitButton = props => {
    const {classes, ...elementProps} = props;
    return (
        <CustomFormContext.Consumer>
            {formContext => (
                <FormSubmitButtonComponent
                    formContext={formContext}
                    {...elementProps}
                />
            )}
        </CustomFormContext.Consumer>
    );
};

SubmitButton.propTypes = {
    classes: PropTypes.object,
    progressMessage: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool
};

SubmitButton.defaultProps = {
    fullWidth: false
};

export default SubmitButton;
