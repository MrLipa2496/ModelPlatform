import http from '../interceptor';

// AUTH
export const signupModelRequest = data =>
  http.post('api/auth/signup/model', data);
export const signupAgencyRequest = data =>
  http.post('api/auth/signup/agency', data);
export const loginRequest = data => http.post('api/auth/login', data);
export const logoutRequest = () => http.get('api/auth/logout');

// MODELS
export const getModelProfileRequest = () => http.get('api/model/profile');
export const updateModelProfileRequest = data =>
  http.put('api/model/profile', data);
export const updateModelPhotoRequest = formData =>
  http.patch('api/model/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getAllModelsRequest = () => http.get('api/model/models');
export const getModelByIdRequest = id => http.get(`api/model/model/${id}`);

// AGENCY
export const getAllAgenciesRequest = () => http.get('api/agency/agencies');
export const getAgencyByIdRequest = id => http.get(`api/agency/agency/${id}`);

// ALBUMS
export const getModelAlbumsRequest = modelId =>
  http.get(`api/albums/model/${modelId}`);

export const createAlbumRequest = (modelId, data) =>
  http.post(`api/albums/${modelId}`, data);

export const uploadAlbumPhotosRequest = (albumId, formData) =>
  http.post(`api/albums/${albumId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateAlbumRequest = (albumId, data) =>
  http.put(`api/albums/${albumId}`, data);

export const deleteAlbumPhotosRequest = (albumId, data) =>
  http.patch(`api/albums/${albumId}/photos`, data);

export const deleteAlbumRequest = albumId =>
  http.delete(`api/albums/${albumId}`);
