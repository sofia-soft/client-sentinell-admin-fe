import * as requester from './requester'

const BaseUrl = '/api/v1/cart';

export const listCart = async (data) => requester.get(`${BaseUrl}/`, data);
export const addItem = async (data) => requester.post(`${BaseUrl}/add/`, data);
export const updateItem = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const deleteCart = async (uuid) => requester.post(`${BaseUrl}/remove/${uuid}/`);
export const checkout = async (uuid) => requester.get(`${BaseUrl}/checkout/`);