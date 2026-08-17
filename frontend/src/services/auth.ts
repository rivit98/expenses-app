import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { createStandaloneToast } from '@chakra-ui/react';
import { api } from '../utils/axiosConfig';
import { store } from '../store/store';
import { removeUser, updateUser } from '../store/userReducer';
import { queryClient } from '../app/queryClient';
import { LoginData, TokenPair, UserData } from '../types/api';
import { texts } from '../constants/texts';

const { toast } = createStandaloneToast();

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
    toast({
        description: texts.auth.sessionExpired,
        status: 'warning',
        duration: 5000,
        isClosable: true,
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
