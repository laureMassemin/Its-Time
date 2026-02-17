import axios from 'axios';

const api = axios.create({
    baseURL: 'https://makeup-api.herokuapp.com'
})


export default api;