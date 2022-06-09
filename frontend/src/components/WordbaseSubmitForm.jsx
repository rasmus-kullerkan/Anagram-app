import React from "react";
import PropTypes from 'prop-types';
import Form from "./Form";
import FormItem from "./FormItem";
import { fetchJson } from "../helpers/FetchHelper";
import { AuthManager } from '../helpers/AuthManager';

const API_URL = process.env.REACT_APP_API_URL;

function parseWordbaseFileContent(content) {
    let result = [];
    let words = null;

    if (content.indexOf(',') !== -1) {
        words = content.split(',');
    } else if (content.indexOf(';') !== -1) {
        words = content.split(';');
    } else {
        words = content.split(/\r?\n/);
    }

    for (let index = 0; index < words.length; index++) {
        const word = words[index].trim();

        if (word.indexOf(' ') !== -1) {
            return [];
        } else {
            result.push(word);
        }
    }

    return result;
}

export default class WordbaseSubmitForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            file: null,

            isSending: false,
            message: null,
            isError: false,
            nameError: null,
            fileError: null
        };

        this.setName = this.setName.bind(this);
        this.setFile = this.setFile.bind(this);
        this.#handleSubmit = this.#handleSubmit.bind(this);
    }

    setName(name) {
        this.setState({
            name: name
        });
    }

    setFile(file) {
        this.setState({
            file: file
        });
    }

    #handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        this.setState({
            fileError: null
        });

        if (!this.state.file) {
            this.setState({
                fileError: "Wordbase file is required",
            });
        } else {
            this.setState({
                message: null,
                isError: false,
                nameError: null,
                fileError: null
            });

            const fileReader = new FileReader();
            
            fileReader.addEventListener("load", (event) => {
                const words = parseWordbaseFileContent(event.target.result);

                if (words.length === 0) {
                    this.setState({
                        fileError: "File contents are invalid",
                    });
                } else {
                    this.setState({
                        isSending: true,
                    });

                    fetchJson(API_URL + "wordbase/create", {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${AuthManager.accessToken()}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.state.name,
                            words: words
                        })
                    }).then(result => {
                        if (result.ok) {
                            this.setState({
                                message: "Wordbase submited succesfully!",
                                isError: false,
                            });
                            this.props.setUpdated(true);
                        } else {
                            if (result.errors.length !== 0) {
                                const errors = [];
                                const nameErrors = [];
                                const fileErrors = [];
            
                                result.errors.forEach(error => {
                                    if (error.field === "name") {
                                        nameErrors.push(error.message);
                                    } else if (error.field === "words") {
                                        fileErrors.push(error.message);
                                    } else {
                                        errors.push(error.message);
                                    }
                                });

                                this.setState({
                                    nameError: nameErrors.join("; "),
                                    fileError: fileErrors.join("; "),
                                    message: errors.join("; "),
                                    isError: true,
                                });
                            } else {
                                this.setState({
                                    message: "Invalid response",
                                    isError: true,
                                });
                            }
                        }

                        this.setState({
                            isSending: false
                        });
                    });
                }
            });

            fileReader.addEventListener('error', event => {
                this.setState({
                    message: fileReader.error.message,
                    isError: true,
                });
            });

            fileReader.readAsText(this.state.file);
        }
    }

    render() {
        return (
            <div className="my-3">
                <h5>Submit your own wordbase</h5>
                Words should be separated by comma, semicolon or by new line.

                <Form onSubmit={this.#handleSubmit} horizontal={true} isSending={this.state.isSending}
                    message={this.state.message} messageIsError={this.state.isError} items={[
                    <FormItem type="text" label="Wordbase name" placeholder="Wordbase name" errorMessage={this.state.nameError} setValue={this.setName}/>,
                    <FormItem type="file" label="Wordbase" errorMessage={this.state.fileError} setValue={this.setFile}/>
                ]}/>
            </div>
        );
    }
}

WordbaseSubmitForm.propTypes = {
    setUpdated: PropTypes.func.isRequired
}