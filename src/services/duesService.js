import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getDuesStatus = async (teamId, year, month, quarter) => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/dues`, {
      params: { year, month, quarter },
    });
    return unwrap(res);
  } catch (err) {
    console.error('회비 현황 조회 실패:', err);
    throw err;
  }
};

export const updateDuesStatus = async (teamId, body) => {
  try {
    const res = await api.put(`/teams/${teamId}/accounting/dues`, body);
    return unwrap(res);
  } catch (err) {
    console.error('회비 상태 변경 실패:', err);
    throw err;
  }
};
