import * as requester from './requester'

const BaseUrl = '/api/v1/auth';

export const loginApi = async (data) => requester.post(`${BaseUrl}/login/`, data);
export const register = async (data) => requester.post(`${BaseUrl}/register/`, data);
export const logout = async () => requester.get(`${BaseUrl}/logout/`)
