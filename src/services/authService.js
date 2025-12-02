import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

// jwt 저장
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      ['@accessToken', accessToken],
      ['@refreshToken', refreshToken],
    ]);
    useAuthStore.getState().setTokens(accessToken, refreshToken);
  } catch (err) {
    console.error('토큰 저장 실패', err);
  }

  // const store = useAuthStore.getState();

  // const prevRefresh = store.refreshToken;

  // store.setTokens(accessToken, refreshToken || prevRefresh);
};

export const exchangeKakaoToken = async kakaoAccessToken => {
  try {
    const response = await fetch(
      'https://moau.store/api/auth/kakao/code/exchange',
      {
        method: 'POST',
        headers: { 'Content-Type': 'applicatoin/json' },
        body: JSON.stringify({ accessToken: kakaoAccessToken }),
      },
    );

    const jwt = await response.json();

    if (!jwt.accessToken || !jwt.refreshToken) {
      throw new Error('JWT 응답 형식이 올바르지 않습니다');
    }
    console.log('서버 jwt :', jwt);
    // saveTokens(jwt.accessToken, jwt.refreshToken);
    return jwt;
  } catch (err) {
    console.err('카카오 토큰 교환 실패 :', err);
    throw err;
  }
};

// 토큰 재발급
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error('Refresh token이 없습니다.');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      throw new Error('백엔드에서 accessToken이 반환되지 않았습니다');
    }

    await saveTokens(accessToken, newRefreshToken);

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    console.error('Access token 갱신 실패:', err);
    return { success: false };
  }
};
