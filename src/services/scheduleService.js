import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getMonthlySchedules = async (teamId, year, month) => {
  try {
    const res = await api.get(`/teams/${teamId}/schedules`, {
      params: { year, month },
    });
    return unwrap(res);
  } catch (err) {
    console.error('월별 일정 조회 실패:', err);
    throw err;
  }
};

export const createSchedule = async (teamId, data) => {
  try {
    const res = await api.post(`/teams/${teamId}/schedules`, data);
    return unwrap(res);
  } catch (err) {
    console.error('일정 생성 실패:', err);
    throw err;
  }
};

export const deleteSchedule = async scheduleId => {
  try {
    const res = await api.delete(`/schedules/${scheduleId}`);
    return unwrap(res);
  } catch (err) {
    console.error('일정 삭제 실패:', err);
    throw err;
  }
};
