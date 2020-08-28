import React, {Fragment} from "react";
import PropTypes from "prop-types";

class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getIn = (obj, path) => {
        const stack = path.split(".");
        let getElement = {...obj};
        while (stack.length) {
            getElement = getElement[stack.shift()];
        }
        return getElement;
    };

    updateIn = (obj, path, value) => {
        let current = obj;
        const stack = path.split(".");
        while (stack.length > 1) {
            current = current[stack.shift()];
        }
        current[stack.shift()] = value;
        return obj;
    };

    linkState = (ctx, path, onUpdateCallback) => ({
        // todo : add type to handle type of input
        // also add preUpdateCallback if required.
        value: this.getIn(ctx.state, path),
        requestChange: (value, onSetCallback) =>
            ctx.setState(this.updateIn(ctx.state, path, value), () => {
                if (onUpdateCallback) {
                    onUpdateCallback(value);
                }
                if (onSetCallback) {
                    onSetCallback(value);
                }
            })
    });

    render() {
        return <Fragment>{this.props.children}</Fragment>;
    }
}

BaseComponent.propTypes = {
    children: PropTypes.any
};

BaseComponent.defaultProps = {
    children: null
};

export default BaseComponent;