import axios from "axios";
import {getToken, logout} from "../token.tsx";
import {pathLogin} from "../../routers/Paths.tsx";


const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Erro: Erro de autenticação, por favor tente novamente.");
                logout()
                window.location.href = pathLogin;
            }
        }
        return Promise.reject(error);
    }
);

export default api;