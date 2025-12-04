import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

export const createNoticeUploadUrl = async (teamId, filename) => {
  try {
    const res = await api.post(`/teams/${teamId}/notices/upload-url`, {
      filename,
    });
    return unwrap(res);
  } catch (err) {
    console.error('공지 이미지 업로드 URL 발급 실패:', err);
    throw err;
  }
};

const getFilenameFromUri = uri => {
  if (!uri) return `notice-${Date.now()}.jpg`;
  const parts = uri.split('/');
  const last = parts[parts.length - 1] || `notice-${Date.now()}.jpg`;
  return last.includes('.') ? last : `${last}.jpg`;
};

export const uploadNoticeImage = async (teamId, fileUri) => {
  if (!fileUri) throw new Error('fileUri is required');

  const filename = getFilenameFromUri(fileUri);
  const { url, key } = await createNoticeUploadUrl(teamId, filename);
  if (!url) throw new Error('Presigned URL이 없습니다.');

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: blob,
  });

  if (!uploadRes.ok) {
    throw new Error(`공지 이미지 업로드 실패: ${uploadRes.status}`);
  }

  const uploadedKey =
    key ||
    url
      .split('?')[0]
      .split('/')
      .slice(-1)[0];

  return uploadedKey;
};

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
    const payload = {
      title: noticeData.title,
      content: noticeData.content,
      isPinned: noticeData.isPinned ?? false,
      imageKeys: noticeData.imageKeys ?? [],
      poll: noticeData.poll,
    };

    const res = await api.post(`/teams/${teamId}/notices`, payload);
    return unwrap(res);
  } catch (err) {
    console.error('공지 생성 실패:', err);
    throw err;
  }
};

export const vote = async (teamId, pollId, voteData) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/notices/polls/${pollId}/vote`,
      voteData,
    );
    return unwrap(res);
  } catch (err) {
    console.error('투표 실패:', err);
    throw err;
  }
};

export const deleteNotice = async (teamId, noticeId) => {
  try {
    const res = await api.delete(`/teams/${teamId}/notices/${noticeId}`);
    return unwrap(res);
  } catch (err) {
    console.error('공지 삭제 실패:', err);
    throw err;
  }
};
