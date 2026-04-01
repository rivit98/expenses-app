import axios from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { store } from '../context/store';
import { updateUser } from '../context/userReducer';
import { LoginData, TokenPair, UserData } from '../types/api';

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
        return Promise.reject(new Error('Your session expired, please login again'));
    }

    try {
        const token = await getNewAccessToken(refreshToken);
        store.dispatch(updateUser(token));
        failedRequest.response.config.headers.Authorization = `Bearer ${token.access}`; // eslint-disable-line no-param-reassign
        return Promise.resolve();
    } catch {
        return Promise.reject(new Error('Your session expired, please login again'));
    }
};

export const authService = {
    login,
    getAccessToken,
    refreshUserToken,
};
