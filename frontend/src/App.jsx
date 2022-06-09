import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation, Footer, Register, Login, Logout, Home, About, Wordbase, Anagram } from './components';
import { AuthManager } from './helpers/AuthManager';

export default function App() {
    const [authenticated, setAuthenticated] = useState(AuthManager.isAuthenticated());

    return (
        <div className="app">
            <Router>
                <Navigation authenticated={authenticated} />
                    <Routes>
                        <Route path="/register" element={<Register authenticated={authenticated} />} />
                        <Route path="/login" element={<Login authenticated={authenticated} setAuthenticated={setAuthenticated} />} />
                        <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated}/>} />

                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />

                        <Route path="/wordbase" element={<Wordbase authenticated={authenticated} />} />
                        <Route path="/anagram" element={<Anagram authenticated={authenticated} />} />
                    </Routes>
                <Footer />
            </Router>
        </div>
    );
}
