import * as requester from './requester'

const BaseUrl = '/api/v1/customers';

export const listCustomers = async (data) => requester.get(`${BaseUrl}/`, data);
export const createCustomer = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateCustomer = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}`, data);
export const deleteCustomer = async (uuid) => requester.post(`${BaseUrl}/delete/${uuid}/`);
export const getCustomer = async (uuid) => requester.get(`${BaseUrl}/${uuid}`);