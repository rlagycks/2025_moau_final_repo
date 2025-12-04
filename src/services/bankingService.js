import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getAccountInfo = async teamId => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/accounts`);
    return unwrap(res);
  } catch (err) {
    console.error('계좌 정보 조회 실패:', err);
    throw err;
  }
};

export const getTransactions = async teamId => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/accounts/transactions`);
    return unwrap(res);
  } catch (err) {
    console.error('거래 내역 조회 실패:', err);
    throw err;
  }
};
