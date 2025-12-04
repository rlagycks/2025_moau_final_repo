import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getDuesStatus = async (teamId, targetDate) => {
  try {
    const res = await api.get(
      `/teams/${teamId}/accounting/dues/cycles/status`,
      {
        params: { targetDate },
      },
    );
    return unwrap(res);
  } catch (err) {
    console.error('회비 현황 조회 실패:', err);
    throw err;
  }
};

export const updateDuesStatus = async (
  teamId,
  cycleId,
  userId,
  status,
  bankAccountId,
  categoryId,
) => {
  try {
    const res = await api.patch(
      `/teams/${teamId}/accounting/dues/cycles/${cycleId}/members/${userId}/status`,
      {
        status,
        bankAccountId: bankAccountId ?? null,
        categoryId: categoryId ?? null,
      },
    );
    return unwrap(res);
  } catch (err) {
    console.error('회비 상태 변경 실패:', err);
    throw err;
  }
};
