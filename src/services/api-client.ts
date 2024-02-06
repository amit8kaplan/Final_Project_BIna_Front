import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    baseURL: 'https://10.10.248.100',
});

export default apiClient;
