// TODO Something less garbage.

export class AuthManager {
    static #exists(name) {
        if (name in sessionStorage) {
            return true;
        } else {
            return false;
        }
    }

    static logIn(username, accessToken) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("accessToken", accessToken);
    }

    static logOut() {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("accessToken");
    }

    static username() {
        if (this.#exists("username")) {
            return sessionStorage.getItem("username").slice();
        } else {
            return null
        }
    }

    static accessToken() {
        if (this.#exists("accessToken")) {
            return sessionStorage.getItem("accessToken").slice();
        } else {
            return null
        }
    }

    static isAuthenticated() {
        if (this.#exists("username") && this.#exists("accessToken")) {
            return true;
        } else {
            return false;
        }
    }
}