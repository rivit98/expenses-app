import axios from 'axios';

const API_PREFIX = 'meters';
const API_VERSION = 'v1';

const getCategories = async (options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/categories/`, options);
};

const getMeters = async (options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/meters/`, options);
};

const addMeter = async (data, options = undefined) => {
    return axios.post(`/${API_PREFIX}/${API_VERSION}/meters/`, data, options);
};

const getMeter = async (id, options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, options);
};

const updateMeter = async (id, data, options = undefined) => {
    return axios.put(`/${API_PREFIX}/${API_VERSION}/meters/${id}/`, data, options);
};

const deleteMeter = async (id, options = undefined) => {
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
