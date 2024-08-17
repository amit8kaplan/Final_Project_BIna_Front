
import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClientWithPython5000 = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});
// export {apiClient,  apiClientWithPython5000};


export default apiClientWithPython5000;
