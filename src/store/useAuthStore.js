// import { logout } from '@react-native-seoul/kakao-login';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 개발용 임시 토큰 설정
 * 
 * 사용 방법:
 * 1. 로그인 없이 테스트하려면 아래에 임시 토큰을 설정하세요:
 *    const TEMP_ACCESS_TOKEN = 'your-temp-token-here';
 * 
 * 2. 카카오 로그인을 사용하려면 null로 설정하세요:
 *    const TEMP_ACCESS_TOKEN = null;
 * 
 * 3. 코드에서 동적으로 설정하려면:
 *    import { setTempToken } from '../services/authService';
 *    setTempToken('your-token-here');
 */
const TEMP_ACCESS_TOKEN = null; // 임시 토큰을 여기에 설정하거나 null로 유지

export const useAuthStore = create(
  persist(
    set => ({
      accessToken: TEMP_ACCESS_TOKEN, // 임시 토큰 또는 null
      refreshToken: null,
      setAccessToken: token => set({ accessToken: token }),
      setRefreshToken: token => set({ refreshToken: token }),
      setTokens: (accessToken, refreshToken) => 
        set({ accessToken, refreshToken }),
      logout: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
