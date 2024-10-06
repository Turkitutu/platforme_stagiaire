import axios from 'axios';
import { getToken } from './storage';

const accessToken = getToken()

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;

if (accessToken)
    axios.defaults.headers.common = { 'Authorization': `Bearer ${accessToken}` };

export const setAccessToken = (token) => {
    axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
    };
}

export default axios;