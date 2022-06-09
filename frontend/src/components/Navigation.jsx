import React from "react";
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { AuthManager } from '../helpers/AuthManager';

class NavItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.dropdown) {
            return (
                <NavLink className="nav-link dropdown-item" to={this.props.to} style={{color: "black"}}>
                    {this.props.value}
                </NavLink>
            );
        } else {
            return (
                <li className="nav-item">
                    <NavLink className="nav-link" to={this.props.to}>
                        {this.props.value}
                    </NavLink>
                </li>
            );
        }
    }
}

function NavItems({ authenticated, dropdown }) {
    return(<>
        <NavItem to="/" value="Home" dropdown={dropdown}/>

        {authenticated ? <NavItem to="/wordbase" value="Wordbase" dropdown={dropdown}/>: null }

        {authenticated ? <NavItem to="/anagram" value="Anagram" dropdown={dropdown}/>: null}

        <NavItem to="/about" value="About" dropdown={dropdown}/>

        {authenticated ? null : <NavItem to="/register" value="Register" dropdown={dropdown}/> }

        <NavItem to={authenticated ? "/logout" : "/login"} 
        value={authenticated ? "(" + AuthManager.username() + ") Logout" : "Login"} dropdown={dropdown}/>
    </>);
}

// https://stackoverflow.com/questions/50980046/bootstrap-dropdown-not-working-in-react
class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }
  
    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
  
    render() {
        const menuClass = `dropdown-menu ${this.state.isOpen ? "show" : ""}`;
        return (
            <div className="dropdown" onClick={this.toggleOpen}>
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                ></button>

                <div className={menuClass} aria-labelledby="dropdownMenuButton">
                    <NavItems authenticated={this.props.authenticated} dropdown={true}/>
                </div>
            </div>
        );
    }
}

// TODO Dropdown menu won't allign right for some reason.

// Navigtion bar
// Use row of links for computer screen and dropdown menu for phones.
export default function Navigation({ authenticated }) {
    return (
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">
                        Anagram App
                    </NavLink>

                    <div className="d-none d-md-block">
                        <ul className="navbar-nav">
                            <NavItems authenticated={authenticated} dropdown={false}/>
                        </ul>
                    </div>

                    <div className="d-md-none me-auto">
                        <Dropdown authenticated={authenticated}/>
                    </div>
                </div>
            </nav>
        </div>
    );
}

Navigation.propTypes = {
    authenticated: PropTypes.bool.isRequired
}