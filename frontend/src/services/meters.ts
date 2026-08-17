import { AxiosRequestConfig } from 'axios';
import { api } from '../utils/axiosConfig';
import { Meter, MeterCategory } from '../types/api';

const API_PREFIX = 'meters';
const API_VERSION = 'v1';

const getCategories = async (options?: AxiosRequestConfig): Promise<MeterCategory[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/categories/`, options);
};

const getMeters = async (options?: AxiosRequestConfig): Promise<Meter[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/meters/`, options);
};

const addMeter = async (data: Partial<Meter>, options?: AxiosRequestConfig): Promise<Meter> => {
    return api.post(`/${API_PREFIX}/${API_VERSION}/meters/`, data, options);
};

const updateMeter = async (id: number, data: Partial<Meter>, options?: AxiosRequestConfig): Promise<Meter> => {
    return api.put(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, data, options);
};

const deleteMeter = async (id: number, options?: AxiosRequestConfig): Promise<void> => {
    return api.delete(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, options);
};

export const metersService = {
    getCategories,
    getMeters,
    addMeter,
    updateMeter,
    deleteMeter,
};
