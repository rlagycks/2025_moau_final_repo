import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const createCategory = async (teamId, body) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/categories`,
      body,
    );
    return unwrap(res);
  } catch (err) {
    console.error('카테고리 생성 실패:', err);
    throw err;
  }
};

export const getCategories = async teamId => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/categories`);
    return unwrap(res);
  } catch (err) {
    console.error('카테고리 조회 실패:', err);
    throw err;
  }
};

export const updateCategory = async (teamId, categoryId, body) => {
  try {
    const res = await api.put(
      `/teams/${teamId}/accounting/categories/${categoryId}`,
      body,
    );
    return unwrap(res);
  } catch (err) {
    console.error('카테고리 수정 실패:', err);
    throw err;
  }
};
