import type { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { queryClient } from '../app/queryClient';
import { toaster } from '../components/Toaster';
import { texts } from '../constants/texts';
import { store } from '../store/store';
import { removeUser, updateUser } from '../store/userReducer';
import type { LoginData, TokenPair, UserData } from '../types/api';
import { api } from '../utils/axiosConfig';

const API_VERSION = 'v1';

const getToken = async (loginData: LoginData): Promise<TokenPair> => {
    return api.post(`/auth/${API_VERSION}/login/`, loginData);
};

const me = async (token: string): Promise<Pick<UserData, 'id' | 'username'>> => {
    return api.get(`/user/${API_VERSION}/me/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const login = async (loginData: LoginData): Promise<UserData> => {
    const token = await getToken(loginData);
    const user = await me(token.access);

    return { ...user, ...token };
};

const getAccessToken = (): string | undefined => {
    return store.getState().userReducer.access;
};

const getRefreshToken = (): string | undefined => {
    return store.getState().userReducer.refresh;
};

const getNewAccessToken = async (refreshToken: string): Promise<TokenPair> => {
    return api.post(
        `/auth/${API_VERSION}/refresh/`,
        {
            refresh: refreshToken,
        },
        {
            skipAuthRefresh: true,
        } as AxiosAuthRefreshRequestConfig
    );
};

const handleSessionExpired = () => {
    store.dispatch(removeUser());
    queryClient.clear();
    toaster.create({
        description: texts.auth.sessionExpired,
        type: 'warning',
        duration: 5000,
        closable: true,
    });
    return Promise.reject(new Error(texts.auth.sessionExpired));
};

const refreshUserToken = async (failedRequest: { response: { config: { headers: Record<string, string> } } }) => {
    const refreshToken = getRefreshToken();
    if (refreshToken == null) {
        return handleSessionExpired();
    }

    try {
        const token = await getNewAccessToken(refreshToken);
        store.dispatch(updateUser(token));
        const { headers } = failedRequest.response.config;
        headers.Authorization = `Bearer ${token.access}`;
        return Promise.resolve();
    } catch {
        return handleSessionExpired();
    }
};

export const authService = {
    login,
    getAccessToken,
    refreshUserToken,
};
