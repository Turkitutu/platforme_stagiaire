import { setAccessToken } from "./api";

export const setToken = (token) => {
    localStorage.setItem('token', token);
}

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const login = async (token, user) => {
    setToken(token);
    setUser(user);
    setAccessToken(token);
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}


export default {
    login,
    getToken,
    getUser,
    logout
}