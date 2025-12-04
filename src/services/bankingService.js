import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const getBanks = async () => {
  try {
    const res = await api.get('/banks');
    return unwrap(res);
  } catch (err) {
    console.error('은행 목록 조회 실패:', err);
    throw err;
  }
};

export const getBalance = async teamId => {
  try {
    const res = await api.get(
      `/teams/${teamId}/accounting/banking/balance`,
    );
    return unwrap(res);
  } catch (err) {
    console.error('계좌 잔액 조회 실패:', err);
    throw err;
  }
};

export const getTransactions = async teamId => {
  try {
    const res = await api.get(
      `/teams/${teamId}/accounting/banking/transactions`,
    );
    return unwrap(res);
  } catch (err) {
    console.error('거래 내역 조회 실패:', err);
    throw err;
  }
};

export const registerAccount = async (
  teamId,
  { alias, bankCode, accountNumber, initialBalanceCents },
) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/banking/account`,
      {
        alias,
        bankCode,
        accountNumber,
        initialBalanceCents,
      },
    );
    return unwrap(res);
  } catch (err) {
    console.error('계좌 등록/수정 실패:', err);
    throw err;
  }
};
