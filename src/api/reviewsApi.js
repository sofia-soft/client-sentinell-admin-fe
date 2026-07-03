import * as requester from './requester'

const BaseUrl = '/api/v1/reviews';

export const listReviews = async () => requester.get(`${BaseUrl}/`);
export const createReview = async (uuid, data) => requester.post(`${BaseUrl}/${uuid}/create/`, data);
export const updateReview = async (uuid, data) => requester.put(`${BaseUrl}/${uuid}/update/`, data)
export const deleteReview = async (uuid) => requester.del(`${BaseUrl}/delete/${uuid}/`)