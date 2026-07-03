import * as requester from './requester'

const BaseUrl = '/api/v1/dashboard';

export const dashboard = async (data) => requester.get(`${BaseUrl}/`, data);


