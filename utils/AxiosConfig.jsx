import axios from "axios";
import CheckToken from "./CheckToken";

let api = axios.create({
    baseURL: "http://localhost:8000"
});

api.interceptors.request.use((config) => {
    let token = CheckToken();
    if(token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
})

export default api;