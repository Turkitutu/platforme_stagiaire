import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.headers.common = { 'Authorization': `bearer test` }
export default axios;