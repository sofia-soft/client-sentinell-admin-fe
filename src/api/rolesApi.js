import * as requester from './requester'

const BaseUrl = '/api/v1/roles';

export const listRoles = async () => requester.get(`${BaseUrl}/`);
export const createRole = async (data) => requester.post(`${BaseUrl}/create/`, data);
export const updateRole= async (uuid, data) => requester.put(`${BaseUrl}/update/${uuid}/`, data);
export const getRole = async (uuid) => requester.get(`${BaseUrl}/${uuid}/`);
export const deleteRole = async (uuid) => requester.del(`${BaseUrl}/delete/${uuid}/`);
export const assignRole = async (uuid) => requester.post(`${BaseUrl}/assign_user_role/${uuid}/`);
export const detachRole = async (uuid) => requester.del(`${BaseUrl}/detach_user_role/${uuid}/`);
export const attachPermissionToRole = async (data) => requester.post(`${BaseUrl}/assign/}`, data);
export const detachPermissionFromRole = async (data) => requester.del(`${BaseUrl}/detach/`, data);

