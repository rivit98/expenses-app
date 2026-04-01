import axios, { AxiosRequestConfig } from 'axios';
import { Meter, MeterCategory } from '../types/api';

const API_PREFIX = 'meters';
const API_VERSION = 'v1';

const getCategories = async (options?: AxiosRequestConfig): Promise<MeterCategory[]> => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/categories/`, options);
};

const getMeters = async (options?: AxiosRequestConfig): Promise<Meter[]> => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/meters/`, options);
};

const addMeter = async (data: Partial<Meter>, options?: AxiosRequestConfig): Promise<Meter> => {
    return axios.post(`/${API_PREFIX}/${API_VERSION}/meters/`, data, options);
};

const getMeter = async (id: number, options?: AxiosRequestConfig): Promise<Meter> => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, options);
};

const updateMeter = async (id: number, data: Partial<Meter>, options?: AxiosRequestConfig): Promise<Meter> => {
    return axios.put(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, data, options);
};

const deleteMeter = async (id: number, options?: AxiosRequestConfig): Promise<void> => {
    return axios.delete(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, options);
};

export const metersService = {
    getCategories,
    getMeters,
    addMeter,
    getMeter,
    updateMeter,
    deleteMeter,
};
