import React from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import BaseComponent from "./BaseComponent";

class SubmitButtonComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            inProgress: false
        };
    }

    componentWillMount() {
        this.props.formContext.registerSubmitButton(this);
    }

    componentWillUnmount() {
        this.props.formContext.unRegisterSubmitButton(this);
    }

    updateInProgress = inProgress => {
        this.setState({inProgress});
    };

    render() {
        const {progressMessage, fullWidth, children, formError = false, customClass = ''} = this.props;
        const inProgress = (this.state.inProgress && formError);
        return (
            <Button
                variant="raised"
                bsStyle="primary"
                type="submit"
                disabled={inProgress}
                bsSize={fullWidth}
                className={customClass}
            >
                {inProgress ? progressMessage : children}
            </Button>
        );
    }
}

SubmitButtonComponent.propTypes = {
    classes: PropTypes.object,
    formContext: PropTypes.object.isRequired,
    progressMessage: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool
};

SubmitButtonComponent.defaultProps = {
    fullWidth: false
};

export default SubmitButtonComponent;
