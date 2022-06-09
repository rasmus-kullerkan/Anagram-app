import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import FormItem from "./FormItem";
import Form from "./Form";
import { fetchJson } from '../helpers/FetchHelper';
import { AuthManager } from '../helpers/AuthManager';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login({ authenticated, setAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate('/');
        }
    }, [])

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // Get access token
    const handleLogin = async (event) => {
        // Prevent page reload
        event.preventDefault();

        setIsSending(true);
        setError(null);
        setUsernameError(null);
        setPasswordError(null);

        fetchJson(API_URL + "user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }).then(result => {
            if (result.ok && result.isValid && result.json.hasOwnProperty("accessToken")) {
                AuthManager.logIn(username, result.json["accessToken"]);
                setAuthenticated(true);
                navigate('/');
            } else {
                if (result.errors.length !== 0) {
                    const errors = [];
                    const usernameErrors = [];
                    const passwordErrors = [];

                    result.errors.forEach(error => {
                        if (error.field === "username") {
                            usernameErrors.push(error.message);
                        } else if (error.field === "password") {
                            passwordErrors.push(error.message);
                        } else {
                            errors.push(error.message);
                        }
                    });
                    
                    setError(errors.join("; "));
                    setUsernameError(usernameErrors.join("; "));
                    setPasswordError(passwordErrors.join("; "));
                } else {
                    setError("Invalid response");
                }
            }

            setIsSending(false);
        });
    }

    return (
        <div className="login">
            <div className="container">
                <div className="row align-items-center my-5">
                    <h1 className="font-weight-light">Login</h1>

                    <div className="row justify-content-center my-5">
                        <Form className="col-md-4" onSubmit={handleLogin} isSending={isSending}
                        message={error} messageIsError={true} submitButtonName="Login" items={[
                            <FormItem type="text" label="Username" placeholder="Username" errorMessage={usernameError} setValue={setUsername}/>,
                            <FormItem type="password" label="Password" placeholder="Password" errorMessage={passwordError} setValue={setPassword}/>
                        ]}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    setAuthenticated: PropTypes.func.isRequired
}