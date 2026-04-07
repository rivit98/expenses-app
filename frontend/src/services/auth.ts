import axios from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { store } from '../store/store';
import { removeUser, updateUser } from '../store/userReducer';
import { queryClient } from '../app/queryClient';
import { LoginData, TokenPair, UserData } from '../types/api';
import { texts } from '../constants/texts';

const API_VERSION = 'v1';

const getToken = async (loginData: LoginData): Promise<TokenPair> => {
    return axios.post(`/auth/${API_VERSION}/login/`, loginData);
};

const me = async (token: string): Promise<Pick<UserData, 'id' | 'username'>> => {
    return axios.get(`/user/${API_VERSION}/me/`, {
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
    return axios.post(
        `/auth/${API_VERSION}/refresh/`,
        {
            refresh: refreshToken,
        },
        {
            skipAuthRefresh: true,
        } as AxiosAuthRefreshRequestConfig
    );
};

const refreshUserToken = async (failedRequest: { response: { config: { headers: Record<string, string> } } }) => {
    const refreshToken = getRefreshToken();
    if (refreshToken == null) {
        store.dispatch(removeUser());
        queryClient.clear();
        return Promise.reject(new Error(texts.auth.sessionExpired));
    }

    try {
        const token = await getNewAccessToken(refreshToken);
        store.dispatch(updateUser(token));
        const { headers } = failedRequest.response.config;
        headers.Authorization = `Bearer ${token.access}`;
        return Promise.resolve();
    } catch {
        store.dispatch(removeUser());
        queryClient.clear();
        return Promise.reject(new Error(texts.auth.sessionExpired));
    }
};

export const authService = {
    login,
    getAccessToken,
    refreshUserToken,
};
