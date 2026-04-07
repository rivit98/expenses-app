import axios, { InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { authService } from '../services/auth';

export const setupAxios = (): void => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://eb.rivit.dev/';

    axios.interceptors.response.use((response) => response.data);

    axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
        const token = authService.getAccessToken();

        if (token != null) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
    });

    createAuthRefreshInterceptor(axios, authService.refreshUserToken);
};
