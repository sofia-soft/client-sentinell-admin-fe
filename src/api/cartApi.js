import * as requester from './requester'

const BaseUrl = '/api/v1/cart';

export const listCart = async () => requester.get(`${BaseUrl}/`);
export const createCart = async (data) => requester.post(`${BaseUrl}/create-cart/`, data);
export const updateItem = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const removeItem = async (uuid, data) => requester.del(`${BaseUrl}/remove/${uuid}/`, data);
export const deleteCart = async (uuid) => requester.del(`${BaseUrl}/clear/${uuid}/`);
export const checkout = async (uuid) => requester.get(`${BaseUrl}/checkout/`);