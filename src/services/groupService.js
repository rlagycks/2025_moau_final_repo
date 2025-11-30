import api from '../api/axiosInstance';

export const createGroup = async data => {
  const response = await api.post('/groups', data);
  return response.data;
};

export const joinGroupByCode = async inviteCode => {
  const response = await api.post('/groups/join', {
    invite_code: inviteCode,
  });
  return response.data;
};
