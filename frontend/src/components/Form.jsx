import React from "react";
import PropTypes from 'prop-types';
import Message from "./Message";

export default class Form extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className={this.props.className}>
                <Message message={this.props.message} isError={this.props.messageIsError}/>
                <form>
                    <div className={this.props.horizontal ? "d-md-flex" : null}>
                        {this.props.items}

                        <div className="p-1">
                            {this.props.horizontal ?
                                <label style={{visibility: 'hidden'}}>placeholder</label>
                                : null
                            }
                            <div className="text-center d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary shadow-none me-2" onClick={this.props.onSubmit}>
                                    {this.props.submitButtonName ? this.props.submitButtonName : 'Submit'}
                                </button>
                                <div className="spinner-border text-info" style={{visibility: this.props.isSending ? 'visible' : 'hidden'}}></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Form.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    items: PropTypes.array,
    className: PropTypes.string,
    isSending: PropTypes.bool,
    submitButtonName: PropTypes.string,
    message: PropTypes.string,
    messageIsError: PropTypes.bool,
    horizontal: PropTypes.bool
}