import * as requester from './requester'

const BaseUrl = '/api/v1/product-attributes';

export const listProductsAttributes = async (data) => requester.get(`${BaseUrl}/`, data);
export const createProductAttribute = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateProductAttribute = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const deleteProductAttribute = async (uuid) => requester.del(`${BaseUrl}/delete/${uuid}/`);
