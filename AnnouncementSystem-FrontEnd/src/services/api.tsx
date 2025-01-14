import axios from "axios";
import {getToken} from "./token.tsx";


const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = getToken(); // A função `getToken()` agora é uma função que garante que o token será recuperado corretamente.
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;