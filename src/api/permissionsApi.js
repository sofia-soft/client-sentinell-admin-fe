import * as requester from './requester'

const BaseUrl = '/api/v1/permissions';

export const listPermissions = async (data) => requester.get(`${BaseUrl}/`, data);
export const createPermissions = async (data) => requester.post(`${BaseUrl}/permissions/`, data);
export const updatePermissions = async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}`, data);
export const deletePermissions = async (uuid) => requester.post(`${BaseUrl}/delete/${uuid}/`);
export const getPermission = async (uuid) => requester.get(`${BaseUrl}/permissions/${uuid}`);

export const getResources = async () => requester.get()