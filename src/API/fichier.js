import axios from 'axios';

const api = axios.create({
    baseURL: 'https://makeup-api.herokuapp.com'
})


export default api;

// Informations sur l'API : https://makeup-api.herokuapp.com/