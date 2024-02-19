import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    //baseURL: 'https://10.10.248.100',
    // baseURL: 'https://193.106.55.100',
    baseURL: 'http://localhost:3000',
});

export default apiClient;
