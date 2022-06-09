import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Form from "./Form";
import FormItem from "./FormItem";
import { AuthManager } from '../helpers/AuthManager';

const API_URL = process.env.REACT_APP_API_URL;

export default function Anagram({ authenticated }) {
    const navigate = useNavigate();

    const [wordbaseNames, setWordbaseNames] = useState(null);
    const [wordbaseNamesError, setWordbaseNamesError] = useState(null);
    const [wordbaseNamesIsLoaded, setWordbaseNamesIsLoaded] = useState(false);

    // Fetch available wordbases.
    useEffect(() => {
        if (!authenticated) {
            navigate('/login');
        } else {
            fetch(API_URL + 'wordbase/names', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${AuthManager.accessToken()}`
                }
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        setWordbaseNames(json["names"])
                    } else {
                        // TODO
                        setWordbaseNamesError("Failed to fetch data!");
                    }  
                    
                    setWordbaseNamesIsLoaded(true);
                });
            }).catch(error => {
                console.log(error.message);
                setWordbaseNamesIsLoaded(true);
                setWordbaseNamesError("Failed to fetch data!");
            });
        }
    }, [])

    const [searchWord, setSearchWord] = useState(null);

    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [result, setResult] = useState(null);
    const [searchWordError, setSearchWordError] = useState(null);

    // Search for anagram
    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        const wordbase = document.getElementById("inputWordbase").value;

        setSearchWordError(null);
        setResult(null);
        setError(null);

        if (!searchWord) {
            setSearchWordError("Search word must not be blank.");
        } else {
            setIsSending(true);

            fetch(API_URL + 'anagram', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${AuthManager.accessToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wordbaseName: wordbase,
                    word: searchWord
                })
            }).then(response => {
                response.json().then(json => {
                    if (response.status === 200) {
                        setResult(json)
                    } else {
                        // TODO
                        setError("Failed to fetch data!");
                    }  
                    
                    setIsSending(false);
                });
            }).catch(error => {
                console.log(error.message);
                setIsSending(false);
                setError("Failed to fetch data!");
            });
        }
    }

    // Anagram search form and result list.
    return (
        <div className="about">
            <div className="container">
                <div className="row align-items-center my-5">
                    <div>
                        <h1 className="font-weight-light">Anagram</h1>

                        {wordbaseNamesIsLoaded ?
                            <>{!wordbaseNamesError ?
                                <>{wordbaseNames && wordbaseNames.length !== 0 ?
                                    <Form onSubmit={handleSubmit} horizontal={true} isSending={isSending}
                                    message={error} messageIsError={true} submitButtonName="Search"
                                        items={[
                                            <div className="form-group p-1">
                                                <label>Wordbase</label>
                                                <select className="form-select" id="inputWordbase">{
                                                    wordbaseNames.map((name) => <option>{name}</option> )
                                                }</select>
                                            </div>,

                                            <FormItem type="text" label="Search" placeholder="Banana"
                                             errorMessage={searchWordError} setValue={setSearchWord}/>
                                        ]
                                    }/>
                                    : <div className="text-danger">No wordbases found</div>
                                }</>
                                : <div className="text-danger">{wordbaseNamesError}</div>
                            }</>
                            : <div className="spinner-border text-info"></div>
                        }

                        {result ?
                            <>{result.length !== 0 ?
                                <>
                                    <h5>Anagrams are:</h5>
                                    {result.map((anagram) => <li>{anagram}</li>)}
                                </>
                                : <div className="text-danger">No anagrams found</div>
                            }</>
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

Anagram.propTypes = {
    authenticated: PropTypes.bool.isRequired
}