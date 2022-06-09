import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { AuthManager } from '../helpers/AuthManager';

const API_URL = process.env.REACT_APP_API_URL;

export default function Logout({ setAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL + 'user/logout', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${AuthManager.accessToken()}`
            }
        });

        AuthManager.logOut()
        setAuthenticated(false);

        navigate('/');
    }, [])
}

Logout.propTypes = {
    setAuthenticated: PropTypes.func.isRequired
}