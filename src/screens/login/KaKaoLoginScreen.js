import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { View, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import BoldText from '../../components/customText/ExtraBoldText';
import SemiBoldText from '../../components/customText/SemiBoldText';
import { loginWithKakao, extractTokensFromCallback, saveTokens } from "../../services/authService";

const KakaoLoginScreen = ({navigation}) => {
    const [showWebView, setShowWebView] = useState(false);
    const [loginUrl, setLoginUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const result = await loginWithKakao();

            console.log('카카오 로그인 결과:', result);

            if (result.success && result.loginUrl) {
                console.log('로그인 URL:', result.loginUrl);
                setLoginUrl(result.loginUrl);
                setShowWebView(true);
            } else {
                console.error('로그인 URL 생성 실패:', result);
                Alert.alert('오류', result.error || '로그인 URL 생성에 실패했습니다.');
                setLoading(false);
            }
        } catch (err) {
            console.error("로그인 실패: ", err);
            Alert.alert('오류', '로그인을 시작할 수 없습니다.');
            setLoading(false);
        }
    };

    const handleShouldStartLoadWithRequest = (request) => {
        const { url, navigationType } = request;
        console.log('WebView 요청:', {
            url,
            navigationType,
            mainDocumentURL: request.mainDocumentURL,
        });
        
        // 콜백 URL 감지 (리다이렉트 URI로 시작하는 경우)
        if (url.includes('http://localhost:8080/login/oauth2/code/kakao') || 
            url.includes('localhost:8080/login/oauth2/code/kakao')) {
            console.log('콜백 URL 감지됨 - 토큰 처리 시작');
            // async 함수를 호출하되 await 없이 실행 (onShouldStartLoadWithRequest는 동기 함수여야 함)
            handleCallbackUrl(url).catch(error => {
                console.error('콜백 처리 에러:', error);
                Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
            });
            return false; // WebView가 이 URL을 로드하지 않도록
        }
        
        // 카카오 도메인 허용
        if (url.includes('kauth.kakao.com') || 
            url.includes('accounts.kakao.com') || 
            url.includes('kakao.com')) {
            console.log('카카오 도메인 허용:', url);
            return true;
        }
        
        // 백엔드 도메인 허용
        if (url.includes('moau.store')) {
            console.log('백엔드 도메인 허용:', url);
            return true;
        }
        
        // 기본적으로 허용 (다른 URL도 정상적으로 로드)
        return true;
    };

    const handleCallbackUrl = async (url) => {
        try {
            console.log('콜백 URL 감지:', url);
            // 토큰 추출 시도
            const tokens = await extractTokensFromCallback(url);
            
            if (tokens && tokens.accessToken && tokens.refreshToken) {
                // 토큰 저장
                saveTokens(tokens.accessToken, tokens.refreshToken);
                setShowWebView(false);
                setLoading(false);
                navigation.replace("UserMain");
                return;
            }

            // URL 파라미터에서 직접 토큰 추출 시도 (백엔드 응답 형식에 따라 다를 수 있음)
            try {
                const urlObj = new URL(url);
                const accessToken = urlObj.searchParams.get('accessToken') || 
                                  urlObj.hash.split('accessToken=')[1]?.split('&')[0];
                const refreshToken = urlObj.searchParams.get('refreshToken') || 
                                   urlObj.hash.split('refreshToken=')[1]?.split('&')[0];
                
                if (accessToken && refreshToken) {
                    saveTokens(accessToken, refreshToken);
                    setShowWebView(false);
                    setLoading(false);
                    navigation.replace("UserMain");
                    return;
                }
            } catch (error) {
                console.error('URL 파라미터 토큰 추출 에러:', error);
            }

            // 토큰을 찾을 수 없는 경우
            console.warn('콜백 URL에서 토큰을 찾을 수 없습니다:', url);
        } catch (error) {
            console.error('토큰 추출 에러:', error);
        }
    };

    const handleWebViewNavigationStateChange = async (navState) => {
        const { url, loading, canGoBack, canGoForward, title } = navState;
        console.log('WebView 네비게이션 상태 변경:', {
            url,
            loading,
            canGoBack,
            canGoForward,
            title,
        });
        
        // 카카오 로그인 페이지 도메인 확인
        if (url.includes('kauth.kakao.com') || url.includes('accounts.kakao.com')) {
            console.log('카카오 로그인 페이지 로드됨');
        }
        
        // 에러 페이지 감지
        if (url.includes('/error') || url.includes('error=')) {
            setShowWebView(false);
            setLoading(false);
            Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다.');
        }
    };

    return(
        <>
            <LinearGradient
            colors={['#7242E2', '#B49BF0', '#FFFFFF']}
            start={{x:0, y:0}}
            end={{x:0, y:0.97}}
            style={styles.gradientContainer}
            >
                <View style={styles.textContainer}>
                    <BoldText style={styles.titleBold}>MOAU</BoldText>
                    <SemiBoldText style={styles.subTitle}>소규모 일정 회계관리 솔루션 </SemiBoldText>
                </View>

                <TouchableOpacity 
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <SemiBoldText style={styles.loginText}>카카오 로그인</SemiBoldText>
                    )}
                </TouchableOpacity>  
            </LinearGradient>

            <Modal
                visible={showWebView}
                animationType="slide"
                onRequestClose={() => {
                    setShowWebView(false);
                    setLoading(false);
                }}
            >
                <View style={styles.webViewContainer}>
                    {loginUrl ? (
                        <WebView
                            source={{ uri: loginUrl }}
                            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                            onNavigationStateChange={handleWebViewNavigationStateChange}
                            onLoadProgress={({ nativeEvent }) => {
                                console.log('WebView 로딩 진행률:', nativeEvent.progress);
                            }}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView 에러:', nativeEvent);
                                Alert.alert(
                                    '로딩 오류',
                                    '페이지를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.',
                                    [
                                        {
                                            text: '닫기',
                                            onPress: () => {
                                                setShowWebView(false);
                                                setLoading(false);
                                            },
                                        },
                                    ]
                                );
                            }}
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView HTTP 에러:', {
                                    statusCode: nativeEvent.statusCode,
                                    description: nativeEvent.description,
                                    url: nativeEvent.url,
                                    title: nativeEvent.title,
                                });
                                
                                // 302 리다이렉트는 정상적인 응답이므로 무시
                                if (nativeEvent.statusCode === 302) {
                                    console.log('302 리다이렉트 감지 - 정상적인 응답');
                                    return;
                                }
                                
                                // 400 이상의 에러만 알림 표시
                                if (nativeEvent.statusCode >= 400) {
                                    console.error(`HTTP ${nativeEvent.statusCode} 에러 발생`);
                                    
                                    let errorMessage = `서버 오류가 발생했습니다. (${nativeEvent.statusCode})`;
                                    
                                    // 403 에러인 경우 백엔드 설정 문제 안내
                                    if (nativeEvent.statusCode === 403) {
                                        errorMessage = `인증 오류가 발생했습니다. (403)\n\n` +
                                            `백엔드 설정을 확인해주세요:\n` +
                                            `- /api/auth/kakao/login 엔드포인트가 공개 엔드포인트로 설정되어 있는지 확인\n` +
                                            `- 인증이 필요 없는 엔드포인트로 설정되어 있는지 확인\n` +
                                            `- CORS 설정이 올바른지 확인`;
                                    }
                                    
                                    Alert.alert(
                                        'HTTP 오류',
                                        errorMessage,
                                        [
                                            {
                                                text: '닫기',
                                                onPress: () => {
                                                    setShowWebView(false);
                                                    setLoading(false);
                                                },
                                            },
                                        ]
                                    );
                                }
                            }}
                            onLoadStart={() => {
                                console.log('WebView 로딩 시작:', loginUrl);
                            }}
                            onLoadEnd={() => {
                                console.log('WebView 로딩 완료');
                            }}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#7242E2" />
                                </View>
                            )}
                            style={styles.webView}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            sharedCookiesEnabled={true}
                            thirdPartyCookiesEnabled={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            originWhitelist={['*']}
                            mixedContentMode="always"
                            allowsBackForwardNavigationGestures={true}
                            incognito={false}
                            cacheEnabled={true}
                            cacheMode="LOAD_DEFAULT"
                            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
                        />
                    ) : (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#7242E2" />
                        </View>
                    )}
                </View>
            </Modal>
        </>
    );
       
        
}

export default KakaoLoginScreen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 300,
        marginTop: 45,
    },
    titleBold: {
        fontSize: 64,
        letterSpacing: 12,
        color: "#FFFFFF",
        marginLeft: 4
    },
    subTitle: {
        fontSize: 22,
        color: "#FFFFFF",
    },
    loginButton: {
        backgroundColor: "#F9E000",
        width: 290,
        height: 59,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50
    },
    loginText: {
        fontSize: 26,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    webView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
})