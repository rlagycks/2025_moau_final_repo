// import { logout } from '@react-native-seoul/kakao-login';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout } from '@react-native-seoul/kakao-login';
import {
  exchangeKakaoToken,
  saveTokens,
  refreshAccessToken,
} from '../services/authService';

// 임시 토큰
// const TEMP_ACCESS_TOKEN =
//   'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NDk2NzkwMzEwIiwidHlwIjoiQVQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc2NDUxNzQyNiwiZXhwIjoxNzY0NTE4MzI2fQ.ZIMwPNk61ioC2xc_10dS9DwWw_iG-Ru_3mYmaMxoYwQ';
// const TEMP_REFRESH_TOKEN =
//   'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0NDk2NzkwMzEwIiwidHlwIjoiUlQiLCJqdGkiOiI2OTk5OWZjNS05ZTM5LTQ5NzEtOWY1YS05MzA4ZDBlYWMwN2MiLCJpYXQiOjE3NjQ1MTc0MjcsImV4cCI6MTc2NTcyNzAyN30.PmXHQc5r5Xbo1NYwIINVgEQZ0yKSL3BmFM_FyVzCWSU';

export const useAuthStore = create(
  // persist(
  (set, get) => ({
    accessToken: null,
    refreshToken: null,
    adminToken: null,

    loading: false,
    _refreshInterval: null,

    setTokens: (accessToken, refreshToken) =>
      set({ accessToken, refreshToken }),
    setAdminToken: adminToken => set({ adminToken }),
    logout: () => {
      clearInterval(get()._refreshInterval);
      set({
        accessToken: null,
        refreshToken: null,
        adminToken: null,
        _refreshInterval: null,
      });
    },

    // 카카오 로그인
    kakaoLogin: async () => {
      set({ loading: true });
      try {
        const result = await login();
        const kakaoAccessToken = result.accessToken;

        const jwt = await exchangeKakaoToken(kakaoAccessToken);

        await saveTokens(jwt.accessToken, jwt.refreshToken);

        return true;
      } catch (err) {
        console.error('카카오 로그인 실패: ', err);
        return false;
      } finally {
        set({ loading: false });
      }
    },

    startTokenAutoRefresh: () => {
      if (get()._refreshInterval) return;

      const interval = setInterval(async () => {
        const { success, accessToken, refreshToken } =
          await refreshAccessToken();

        if (!success) {
          console.warn('자동 refresh 실패 : 로그아웃');
          get().logout();
        } else {
          console.log('자동 refresh 성공: ', accessToken);
          await saveTokens(accessToken, refreshToken);
        }
      }, 4 * 60 * 1000);
      set({ _refreshInterval: interval });
    },
  }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => AsyncStorage),
  },
  // ),
);
