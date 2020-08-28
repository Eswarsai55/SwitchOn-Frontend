import React from "react";
import PropTypes from "prop-types";
import BaseComponent from "./BaseComponent";
import CustomFormContext from "./CustomFormContext";

class CustomForm extends BaseComponent {
    constructor(props) {
        super(props);
        this.elements = [];
        this.submitButtons = [];
        this.state = {};
        this.formContextValue = {
            registerElement: element => {
                this.elements.push(element);
            },
            unRegisterElement: element => {
                this.elements.splice(this.elements.indexOf(element));
            },
            registerSubmitButton: submitButton => {
                this.submitButtons.push(submitButton);
            },
            unRegisterSubmitButton: submitButton => {
                this.submitButtons.splice(this.submitButtons.indexOf(submitButton));
            }
        };

        this.submitProgressCallback = {
            done: () => {
                this.submitButtons.forEach(submitButton => {
                    submitButton.updateInProgress(false);
                });
            }
        };
    }

    onSubmit = event => {
        event.preventDefault();
        if (this.validateAll()) {
            this.submitButtons.forEach(submitButton => {
                submitButton.updateInProgress(true);
            });
            this.props.onValidSubmit(this.submitProgressCallback);
        }
        return false;
    };

    validateAll = () => {
        const failedElements = [];
        this.elements.forEach(element => {
            if (!element.validate()) {
                failedElements.push(element);
            }
        });
        return failedElements.length === 0;
    };

    render() {
        return (
            <CustomFormContext.Provider value={this.formContextValue}>
                <form
                    className="w-percent-100 flex-full"
                    autoComplete="off"
                    onSubmit={this.onSubmit}
                >
                    {this.props.children}
                </form>
            </CustomFormContext.Provider>
        );
    }
}

CustomForm.propTypes = {
    classes: PropTypes.object,
    onValidSubmit: PropTypes.func.isRequired
};

CustomForm.defaultProps = {};

export default CustomForm;
