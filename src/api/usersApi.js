import * as requester from './requester'

const BaseUrl = '/api/v1/users';

export const listUsers = async () => requester.get(`${BaseUrl}/`);
export const createUser = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateUsers = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data)
export const getUser = async (uuid) => requester.get(`${BaseUrl}/${uuid}/`)
export const deleteUser = async (uuid) => requester.del(`${BaseUrl}/delete/${uuid}/`)

