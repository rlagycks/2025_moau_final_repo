import api from '../api/axiosInstance';

// 게시글 목록 조회
export const getPostList = async (teamId, page = 0, size = 10) => {
  try {
    const res = await api.get(`/teams/${teamId}/posts`, {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return res.data.data;
  } catch (err) {
    console.error('게시글 목록 조회 실패: ', err);
    throw err;
  }
};

// 게시글 상세 조회
export const getPostDetail = async (teamId, postId) => {
  try {
    const res = await api.get(`/teams/${teamId}/posts/${postId}`);
    return res.data.data;
  } catch (err) {
    console.error('게시글 상세 조회 실패: ', err);
    throw err;
  }
};

// 게시글 작성
export const createPost = async (teamId, postData) => {
  try {
    const res = await api.post(`/teams/${teamId}/posts`, postData);
    return res.data.data;
  } catch (err) {
    console.error('게시글 작성 실패: ', err);
    throw err;
  }
};

// 게시글 삭제
export const deletePost = async (teamId, postId) => {
  try {
    return await api.delete(`/teams/${teamId}/posts/${postId}`);
  } catch (err) {
    console.error('게시글 삭제 실패: ', err);
    throw err;
  }
};

// 댓글 작성
export const createComment = async (teamId, postId, commentData) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/posts/${postId}/comments`,
      commentData,
    );
    return res.data.data;
  } catch (err) {
    console.error('댓글 작성 실패: ', err);
    throw err;
  }
};

// 댓글 삭제
export const deleteComment = async (teamId, postId, commentId) => {
  try {
    return await api.delete(
      `/teams/${teamId}/posts/${postId}/comments/${commentId}`,
    );
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    throw err;
  }
};
