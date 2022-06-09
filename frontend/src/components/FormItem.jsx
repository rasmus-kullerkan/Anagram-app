import React from "react";
import PropTypes from 'prop-types';

export default class FormItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="form-group p-1">
                <label>{this.props.label}</label>

                <input type={this.props.type} className="form-control" placeholder={this.props.placeholder}
                    onChange={(e) => {
                        if (this.props.type === "file") {
                            this.props.setValue(e.target.files[0]);
                        } else {
                            this.props.setValue(e.target.value);
                        }
                    }}

                    onClick={this.props.type === "file" ?
                        (event)=> {
                            if (this.props.type === "file") {
                                event.target.value = null
                            }
                        }
                        : null
                    }
                />

                {this.props.errorMessage ?
                    <small className="text-danger">{this.props.errorMessage}</small>
                    : <small className="text-danger" style={{visibility: 'hidden'}}>placeholder</small>
                }
            </div>
        );
    }
}

FormItem.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    setValue: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errorMessage: PropTypes.string
}