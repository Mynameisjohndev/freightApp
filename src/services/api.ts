import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.spotx.com.br',
});

export default api;
