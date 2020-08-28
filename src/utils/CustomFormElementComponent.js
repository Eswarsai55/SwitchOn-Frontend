import React from "react";
import PropTypes from "prop-types";
import {ControlLabel, FormGroup, HelpBlock} from "react-bootstrap";
import BaseComponent from "./BaseComponent";

class CustomFormElementComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            failedValidation: null
        };
    }

    componentWillMount() {
        this.props.formContext.registerElement(this);
    }

    componentWillUnmount() {
        this.props.formContext.unRegisterElement(this);
    }

    validate = () => {
        const {valueLink, validations} = this.props;
        let failedValidation = null;
        if (validations) {
            failedValidation = validations.find(
                validation => validation.validate(valueLink.value) === false
            );
            failedValidation =
                failedValidation !== undefined ? failedValidation : null;
        }

        this.setState({failedValidation});
        return failedValidation === null;
    };

    render() {
        const {
            // classes,
            valueLink,
            label,
            required,
            // hint,
            helpText,
            controlType,
            control: {type, settings}
        } = this.props;
        const {failedValidation} = this.state;
        const FormElementControl = type;

        const requiredStyle = {
            color: "red"
        };

        return (
            <div>
                {label && (
                    required ? (
                        <ControlLabel>{label} <span style={requiredStyle}>*</span></ControlLabel>
                    ) : (
                        <ControlLabel>{label}</ControlLabel>
                    )

                )}
                <FormGroup
                    controlId={Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
                    validationState={failedValidation ? "error" : ""}>

                    <FormElementControl
                        valueLink={valueLink}
                        onBlur={this.validate}
                        type={controlType || 'text'}
                        failedValidation={this.state.failedValidation}
                        {...settings}
                    />
                    <HelpBlock type="invalid">
                        {failedValidation ? failedValidation.message : helpText}
                    </HelpBlock>
                </FormGroup>
            </div>

        );
    }
}

CustomFormElementComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
    valueLink: PropTypes.object.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    hint: PropTypes.object,
    helpText: PropTypes.string,
    validations: PropTypes.array,
    control: PropTypes.object.isRequired
};

CustomFormElementComponent.defaultProps = {
    label: null,
    required: false,
    hint: null,
    helpText: "",
    validations: []
};

export default CustomFormElementComponent;