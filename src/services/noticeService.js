import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getNotices = async (teamId, page = 0, size = 10) => {
  try {
    const res = await api.get(`/teams/${teamId}/notices`, {
      params: { page, size },
    });
    return unwrap(res);
  } catch (err) {
    console.error('공지 목록 조회 실패:', err);
    throw err;
  }
};

export const getNoticeDetail = async (teamId, noticeId) => {
  try {
    const res = await api.get(`/teams/${teamId}/notices/${noticeId}`);
    return unwrap(res);
  } catch (err) {
    console.error('공지 상세 조회 실패:', err);
    throw err;
  }
};

export const createNotice = async (teamId, noticeData) => {
  try {
    const res = await api.post(`/teams/${teamId}/notices`, noticeData);
    return unwrap(res);
  } catch (err) {
    console.error('공지 생성 실패:', err);
    throw err;
  }
};

export const vote = async (teamId, pollId, voteData) => {
  try {
    const res = await api.post(`/teams/${teamId}/votes/${pollId}`, voteData);
    return unwrap(res);
  } catch (err) {
    console.error('투표 실패:', err);
    throw err;
  }
};
