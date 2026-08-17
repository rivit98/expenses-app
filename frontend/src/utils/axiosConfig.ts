import axios, { InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { authService } from '../services/auth';

// Dedicated instance so response/request interceptors below only affect our own
// API calls, not the global axios default (and its declared types stay honest).
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://eb.rivit.dev/',
});

export const setupAxios = (): void => {
    api.interceptors.response.use((response) => response.data);

    api.interceptors.request.use((request: InternalAxiosRequestConfig) => {
        const token = authService.getAccessToken();

        if (token != null) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
    });

    createAuthRefreshInterceptor(api, authService.refreshUserToken);
};
