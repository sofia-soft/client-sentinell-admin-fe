import * as requester from './requester'

const BaseUrl = '/api/v1/products';

export const listProducts = async (data) => requester.get(`${BaseUrl}/`, data);
export const createProduct = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateProduct = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}`, data);
export const deleteProduct = async (uuid) => requester.post(`${BaseUrl}/delete/${uuid}/`);
export const getProduct = async (uuid) => requester.get(`${BaseUrl}/${uuid}`);