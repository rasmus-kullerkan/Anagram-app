import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import FormItem from "./FormItem";
import { fetchJson } from "../helpers/FetchHelper";

const API_URL = process.env.REACT_APP_API_URL;

export default function Register({ authenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate('/');
        }
    }, [])

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const handleRegister = async (event) => {
        // Prevent page reload
        event.preventDefault();

        setIsSending(true);
        setMessage(null);
        setIsError(false);
        setUsernameError(null);
        setPasswordError(null);

        fetchJson(API_URL + "user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }).then(result => {
            if (result.ok) {
                setMessage("Account created succesfully!");
                setIsError(false);
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
                    setMessage(errors.join("; "));
                    setIsError(true);
                    setUsernameError(usernameErrors.join("; "));
                    setPasswordError(passwordErrors.join("; "));
                } else {
                    setMessage("Invalid response");
                    setIsError(true);
                }
            }

            setIsSending(false);
        });
    }

    return (
        <div className="register">
            <div className="container">
                <div className="row align-items-center my-5">
                    <h1 className="font-weight-light">Register</h1>
                    
                    <div className="row justify-content-center my-5">
                        <Form className="col-md-4" onSubmit={handleRegister} isSending={isSending}
                        message={message} messageIsError={isError} submitButtonName="Register" items={[
                            <FormItem type="text" label="Username" placeholder="Username" errorMessage={usernameError} setValue={setUsername}/>,
                            <FormItem type="password" label="Password" placeholder="Password" errorMessage={passwordError} setValue={setPassword}/>
                        ]}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

Register.propTypes = {
    authenticated: PropTypes.bool.isRequired
}