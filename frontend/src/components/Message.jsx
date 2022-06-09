import React from "react";
import PropTypes from 'prop-types';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.message) {
            return <div className={this.props.isError ? "text-danger" : "text-success"}>{this.props.message}</div>
        } else {
            return <div className="text-danger" style={{visibility: 'hidden'}}>placeholder</div>
        }
    }
}

Message.propTypes = {
    message: PropTypes.string,
    isError: PropTypes.bool
}