import api from '../api/axiosInstance';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const REST_API_KEY = 'e2f36d079866b90e1a76d7dea20892c2';
const REDIRECT_URI = 'http://localhost:8080/login/oauth2/code/kakao';

/**
 * 카카오 로그인 URL 생성
 * @param {string} state - CSRF 방지를 위한 state 값
 * @returns {string} 카카오 로그인 URL
 */
export const getKakaoLoginUrl = (state) => {
  const baseURL = 'https://moau.store/api/auth/kakao/login';
  const params = new URLSearchParams({
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    state: state,
  });
  return `${baseURL}?${params.toString()}`;
};

/**
 * 인증 코드를 토큰으로 교환 (스웨거 명세 기반)
 * @param {string} code - 인증 코드
 * @returns {Promise<Object>} 토큰 정보
 */
export const exchangeCodeForTokens = async (code) => {
  try {
    const response = await api.post('/auth/exchangeCode', {
      code: code,
    });

    if (response.data && response.data.accessToken && response.data.refreshToken) {
      return {
        success: true,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }

    throw new Error('토큰 응답 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('exchangeCode API 호출 에러:', error);
    console.error('에러 상세:', error.response?.data);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * 카카오 로그인 콜백에서 토큰 추출
 * 백엔드가 콜백 URL에 code를 포함시키고, exchangeCode API를 통해 토큰을 받음
 * @param {string} callbackUrl - 콜백 URL
 * @returns {Promise<Object|null>} 토큰 정보 또는 null
 */
export const extractTokensFromCallback = async (callbackUrl) => {
  try {
    const url = new URL(callbackUrl);
    
    // URL 파라미터에서 직접 토큰 추출 시도 (백엔드가 직접 토큰을 반환하는 경우)
    const accessToken = url.searchParams.get('accessToken');
    const refreshToken = url.searchParams.get('refreshToken');
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }

    // 해시에서 토큰 추출 시도
    if (url.hash) {
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const hashAccessToken = hashParams.get('accessToken');
      const hashRefreshToken = hashParams.get('refreshToken');
      
      if (hashAccessToken && hashRefreshToken) {
        return { accessToken: hashAccessToken, refreshToken: hashRefreshToken };
      }
    }

    // code 파라미터가 있으면 exchangeCode API를 통해 토큰 받기
    const code = url.searchParams.get('code');
    
    if (code) {
      const result = await exchangeCodeForTokens(code);
      if (result.success) {
        return {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('콜백 URL 파싱 에러:', error);
    return null;
  }
};

/**
 * 카카오 로그인 처리
 * 백엔드 API를 호출하여 리다이렉트 URL을 가져옴
 * @returns {Promise<Object>} 로그인 결과
 */
export const loginWithKakao = async () => {
  try {
    // state 생성 (CSRF 방지)
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const loginUrl = getKakaoLoginUrl(state);
    
    // 백엔드 API를 직접 호출하여 리다이렉트 URL 확인
    // 공개 엔드포인트이므로 토큰 없이 호출하기 위해 일반 axios 사용
    try {
      const publicApi = axios.create({
        baseURL: 'https://moau.store/api',
        timeout: 5000,
        maxRedirects: 0, // 리다이렉트를 자동으로 따라가지 않음
        validateStatus: (status) => status >= 200 && status < 400, // 302도 정상으로 처리
      });

      const response = await publicApi.get('/auth/kakao/login', {
        params: {
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          state: state,
        },
      });

      console.log('백엔드 응답 상태:', response.status);
      console.log('백엔드 응답 헤더:', response.headers);

      // 302 리다이렉트인 경우 Location 헤더에서 URL 추출
      if (response.status === 302 || response.status === 301) {
        const redirectUrl = response.headers.location || response.headers.Location;
        if (redirectUrl) {
          console.log('리다이렉트 URL:', redirectUrl);
          // 상대 경로인 경우 절대 경로로 변환
          const finalUrl = redirectUrl.startsWith('http') 
            ? redirectUrl 
            : `https://moau.store${redirectUrl}`;
          return {
            success: true,
            loginUrl: finalUrl, // 카카오 로그인 페이지 URL 사용
            state,
          };
        }
      }

      // 리다이렉트가 아닌 경우 원래 URL 사용
      return {
        success: true,
        loginUrl,
        state,
      };
    } catch (axiosError) {
      // 302 에러는 정상적인 리다이렉트이므로 Location 헤더 확인
      if (axiosError.response && (axiosError.response.status === 302 || axiosError.response.status === 301)) {
        const redirectUrl = axiosError.response.headers.location || axiosError.response.headers.Location;
        if (redirectUrl) {
          console.log('리다이렉트 URL (에러 응답에서):', redirectUrl);
          const finalUrl = redirectUrl.startsWith('http') 
            ? redirectUrl 
            : `https://moau.store${redirectUrl}`;
          return {
            success: true,
            loginUrl: finalUrl,
            state,
          };
        }
      }
      
      // 403 에러인 경우 백엔드가 이 엔드포인트를 공개로 처리하지 않는 것일 수 있음
      // 이 경우 원래 URL을 WebView에 직접 로드하여 리다이렉트를 WebView가 처리하도록 함
      if (axiosError.response && axiosError.response.status === 403) {
        console.warn('403 에러 발생 - 백엔드가 이 엔드포인트를 공개로 처리하지 않을 수 있습니다.');
        console.warn('WebView가 직접 리다이렉트를 처리하도록 원래 URL 사용');
      } else {
        console.warn('백엔드 API 직접 호출 실패, 원래 URL 사용:', axiosError.message);
      }
      
      // API 호출 실패 시 원래 URL 사용 (WebView가 리다이렉트를 처리)
      return {
        success: true,
        loginUrl,
        state,
      };
    }
  } catch (error) {
    console.error('카카오 로그인 URL 생성 에러:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 토큰 저장
 * @param {string} accessToken - Access Token
 * @param {string} refreshToken - Refresh Token
 */
export const saveTokens = (accessToken, refreshToken) => {
  const { setTokens } = useAuthStore.getState();
  setTokens(accessToken, refreshToken);
};

/**
 * 토큰 재발급
 * @returns {Promise<Object>} 새로운 토큰 정보
 */
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = useAuthStore.getState();
    
    if (!refreshToken) {
      throw new Error('Refresh token이 없습니다.');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken: refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    // 새로운 토큰 저장
    saveTokens(newAccessToken, newRefreshToken);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('토큰 재발급 에러:', error);
    
    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      logout();
    }
    
    throw error;
  }
};

/**
 * 로그아웃
 */
export const logout = () => {
  const { logout: logoutStore } = useAuthStore.getState();
  logoutStore();
};

/**
 * 임시 토큰 설정 (개발/테스트용)
 * @param {string} token - 임시 Access Token
 */
export const setTempToken = (token) => {
  const { setAccessToken } = useAuthStore.getState();
  setAccessToken(token);
  console.log('임시 토큰이 설정되었습니다.');
};

