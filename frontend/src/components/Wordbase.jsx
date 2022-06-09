import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import WordbaseTable from "./WordbaseTable";
import WordbaseSubmitForm from "./WordbaseSubmitForm";

export default function Wordbase({ authenticated }) {
    const navigate = useNavigate();

    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        if (!authenticated) {
            navigate('/login');
        }
    }, [])

    return (
        <div className="contact">
            <div className="container">
                <div className="row align-items-center my-5">
                    <div>
                        <h1 className="font-weight-light">Wordbase</h1>

                        <WordbaseSubmitForm setUpdated={setUpdated}/>
                        <WordbaseTable updated={updated} setUpdated={setUpdated}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

Wordbase.propTypes = {
    authenticated: PropTypes.bool.isRequired
}