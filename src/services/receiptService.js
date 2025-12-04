import api from '../api/axiosInstance';

const unwrap = res => res?.data?.data ?? res?.data;

const getFilenameFromUri = uri => {
  if (!uri) return `receipt-${Date.now()}.jpg`;
  const parts = uri.split('/');
  const last = parts[parts.length - 1] || `receipt-${Date.now()}.jpg`;
  return last.includes('.') ? last : `${last}.jpg`;
};

const detectMimeType = filename => {
  if (!filename) return 'image/jpeg';
  const lower = filename.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

export const createPresignedUrl = async (teamId, filename) => {
  try {
    const res = await api.post(`/teams/${teamId}/accounting/receipts/upload-url`, {
      filename,
    });
    return unwrap(res);
  } catch (err) {
    console.error('Presigned URL 발급 실패:', err);
    throw err;
  }
};

export const uploadImageToS3 = async (teamId, fileUri) => {
  if (!fileUri) throw new Error('fileUri is required');

  const filename = getFilenameFromUri(fileUri);
  const mimeType = detectMimeType(filename);

  const { url } = await createPresignedUrl(teamId, filename);
  if (!url) throw new Error('Presigned URL이 없습니다.');

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
    },
    body: blob,
  });

  if (!uploadRes.ok) {
    throw new Error(`S3 업로드 실패: ${uploadRes.status}`);
  }

  // 업로드된 실제 접근 URL은 쿼리스트링을 제외한 부분
  const uploadedUrl = url.split('?')[0];
  return uploadedUrl;
};

export const createReceipt = async (teamId, payload) => {
  try {
    const res = await api.post(`/teams/${teamId}/accounting/receipts`, payload);
    return unwrap(res);
  } catch (err) {
    console.error('영수증 생성 실패:', err);
    throw err;
  }
};

export const getReceipts = async teamId => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/receipts`);
    return unwrap(res);
  } catch (err) {
    console.error('영수증 목록 조회 실패:', err);
    throw err;
  }
};

export const getReceiptDetail = async (teamId, receiptId) => {
  try {
    const res = await api.get(`/teams/${teamId}/accounting/receipts/${receiptId}`);
    return unwrap(res);
  } catch (err) {
    console.error('영수증 상세 조회 실패:', err);
    throw err;
  }
};

export const requestReview = async (teamId, receiptId, body) => {
  try {
    const res = await api.post(
      `/teams/${teamId}/accounting/receipts/${receiptId}/request-review`,
      body,
    );
    return unwrap(res);
  } catch (err) {
    console.error('영수증 검토 요청 실패:', err);
    throw err;
  }
};
