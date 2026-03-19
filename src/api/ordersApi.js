import * as requester from './requester'

const BaseUrl = '/api/v1/orders';

export const listOrders = async (data) => requester.get(`${BaseUrl}/`, data);
export const getOrder = async (uuid) => requester.get(`${BaseUrl}/${uuid}/`);
export const updateOrder = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const deleteOrder = async (uuid) => requester.post(`${BaseUrl}/remove/${uuid}/`);
