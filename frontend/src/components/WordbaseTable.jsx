import React from "react";
import PropTypes from 'prop-types';
import { fetchJson } from "../helpers/FetchHelper";
import { AuthManager } from '../helpers/AuthManager';

const API_URL = process.env.REACT_APP_API_URL;

export default class WordbaseTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            error: null,
            wordbaseNames: null
        };
    }

    updateTable() {
        // Fetch available wordbases.
        fetchJson(API_URL + 'wordbase/names', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${AuthManager.accessToken()}`
            }
        }).then(result => {
            if (result.ok && result.isValid && result.json.hasOwnProperty("names")) {
                this.setState({
                    wordbaseNames: result.json["names"]
                });
            } else {
                if (result.errors.length !== 0) {
                    const errors = [];

                    result.errors.forEach(error => {
                        errors.push(error.message);
                    });
                    
                    this.setState({
                        error: errors.join("; ")
                    });
                } else {
                    this.setState({
                        error: "Invalid response"
                    });
                }
            }

            this.setState({
                isLoaded: true
            });
        });
    }

    componentDidMount() {
        this.updateTable();
    }

    componentDidUpdate() {
        if (this.props.updated) {
            this.updateTable();
            this.props.setUpdated(false);
        }
    }

    render() {
        return (
            <div>
                <h5>Available wordbases:</h5>
                
                <div>
                    {this.state.error !== null ? 
                        <div className="text-danger">{this.state.error}</div> 
                        : <div style={{visibility: 'hidden'}}>placeholder</div>
                    }

                    {this.state.isLoaded ?
                        <>{this.state.wordbaseNames && this.state.wordbaseNames.length !== 0 ?
                            this.state.wordbaseNames.map((name) => <li>{name}</li>)
                            : <>{!this.state.error ? <div className="text-danger">No wordbases found</div> : null}</>
                        }</>
                        : <div className="spinner-border text-info"></div>
                    }
                </div>
            </div>
        );
    }
}

WordbaseTable.propTypes = {
    updated: PropTypes.bool.isRequired,
    setUpdated: PropTypes.func.isRequired
}