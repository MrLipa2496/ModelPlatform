import http from '../interceptor';

// AUTH
export const signupModelRequest = data =>
  http.post('api/auth/signup/model', data);
export const signupAgencyRequest = data =>
  http.post('api/auth/signup/agency', data);
export const loginRequest = data => http.post('api/auth/login', data);
export const logoutRequest = () => http.post('api/auth/logout');

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
export const getAgencyProfileRequest = () => http.get('api/agency/profile');
export const updateAgencyProfileRequest = data =>
  http.put('api/agency/profile', data);
export const updateAgencyLogoRequest = formData =>
  http.patch('api/agency/profile/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

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

// CASTINGS (api/castings)
export const getAllCastingsRequest = () => http.get('api/castings');
export const getCastingByIdRequest = id => http.get(`api/castings/${id}`);
export const createCastingRequest = data => http.post('api/castings', data);
export const updateCastingRequest = (id, data) =>
  http.put(`api/castings/${id}`, data);
export const deleteCastingRequest = id => http.delete(`api/castings/${id}`);
export const getMyCastingsRequest = () => http.get('api/castings/my/agencies');

// APPLICATIONS (api/applications)
export const createApplicationRequest = data =>
  http.post('api/applications', data);
export const getMyApplicationsRequest = () =>
  http.get('api/applications/applications');
export const getAgencyApplicationsRequest = () =>
  http.get('api/applications/agency');
export const getApplicationsForCastingRequest = castingId =>
  http.get(`api/applications/casting/${castingId}`);
export const respondToApplicationRequest = (id, data) =>
  http.patch(`api/applications/${id}/respond`, data);

// INVITATIONS (api/invitations)
export const createInvitationRequest = data =>
  http.post('api/invitations', data);
export const getMySentInvitationsRequest = () =>
  http.get('api/invitations/sent');
export const getMyInvitationsRequest = () => http.get('api/invitations/my');
export const respondToInvitationRequest = (id, data) =>
  http.patch(`api/invitations/${id}/respond`, data);

// MESSAGES (api/messages)
export const sendMessageRequest = data => http.post('api/messages', data);
export const getConversationsRequest = () => http.get('api/messages');
export const getMessagesWithUserRequest = userId =>
  http.get(`api/messages/${userId}`);
