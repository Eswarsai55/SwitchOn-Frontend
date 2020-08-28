import React from "react";
import PropTypes from "prop-types";
import {FormControl, InputGroup} from 'react-bootstrap'

const getFormControl = props => {
    const {
        // classes,
        onBlur,
        valueLink,
        type,
        // prefix,
        // suffix,
        maxLength,
        placeholder,
        multiline,
        disabled
    } = props;
    return (
        <FormControl
            type={type}
            multiline={multiline}
            maxLength={maxLength}
            placeholder={placeholder}
            disabled={disabled}
            value={valueLink.value}
            onChange={event => valueLink.requestChange(event.target.value)}
            onBlur={onBlur}
        />
    );
};
const TextControl = props => {
    return (
        <div>
            {
                (props.prefix || props.suffix) ? (
                    <InputGroup>
                        <InputGroup.Addon>{props.prefix}</InputGroup.Addon>
                        {getFormControl(props)}
                        <InputGroup.Addon>{props.suffix}</InputGroup.Addon>
                    </InputGroup>
                ) : getFormControl(props)

            }
        </div>
    );
};

TextControl.propTypes = {
    classes: PropTypes.object,
    onBlur: PropTypes.func.isRequired,
    valueLink: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["text", "password"]),
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    multiline: PropTypes.bool,
    disabled: PropTypes.bool
};

TextControl.defaultProps = {
    type: "text",
    prefix: null,
    suffix: null,
    maxLength: 250,
    placeholder: "",
    multiline: false,
    disabled: false
};

export {TextControl};