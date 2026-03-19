import * as requester from './requester'

const BaseUrl = '/api/v1/categories';

export const listCategories = async (data) => requester.get(`${BaseUrl}/`, data);
export const createCategory = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateCategory = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const deleteCategory = async (uuid) => requester.post(`${BaseUrl}/delete/${uuid}/`);
export const getCategory = async (uuid) => requester.get(`${BaseUrl}/${uuid}/`);