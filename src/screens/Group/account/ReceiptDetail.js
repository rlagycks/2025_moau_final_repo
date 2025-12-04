import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import { useRoute } from "@react-navigation/native";
import SemiBoldText from "../../../components/customText/SemiBoldText";
import RegularText from "../../../components/customText/RegularText";
import LinearGradient from "react-native-linear-gradient";

import acceptIcon from '../../../assets/img/acceptIcon.png';
import standbyIcon from '../../../assets/img/standbyIcon.png';
import refusalIcon from '../../../assets/img/refusalIcon.png';
import BoldText from "../../../components/customText/BoldText";
import * as receiptService from "../../../services/receiptService";


const ReceiptDetail = ({navigation}) => {
    const route = useRoute();
    const {receipt = {}, teamId, groupId, isAdmin = false} = route.params || {};
    const [detail, setDetail] = useState(receipt);
    const [loading, setLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const receiptId = receipt?.receiptId || receipt?.id || route.params?.receiptId;

    useEffect(() => {
        const fetchDetail = async () => {
            if (!teamId || !receiptId) return;
            setLoading(true);
            try {
                const data = await receiptService.getReceiptDetail(teamId, receiptId);
                setDetail(data);
            } catch (err) {
                console.error("영수증 상세 조회 실패:", err);
                Alert.alert("오류", "영수증 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [teamId, receiptId]);

    const getStateConfig = (state) => {
        switch (state) {
            case "승인":
                return {
                    message: "승인 완료",
                    icon: acceptIcon,
                };
            case "대기":
                return {
                    message: "승인 대기 중",
                    icon: standbyIcon,
                };
            case "거절":
                return {
                    message: "승인 거절",
                    icon: refusalIcon,
                    reason: "지출 내역이 불명확합니다. 재업로드 바랍니다.",
                };
            default:
                return {
                    message: "상태 없음",
                    icon: null,
                };
        }
    };

    const statusLabel = useMemo(() => {
        const status = detail.status || detail.reviewStatus || detail.state;
        if (status === "APPROVE" || status === "APPROVED") return "승인";
        if (status === "REJECT" || status === "REJECTED") return "거절";
        return "대기";
    }, [detail]);

    const stateConfig = getStateConfig(statusLabel);

    const handleReview = async action => {
        if (!teamId || !receiptId) return;
        try {
            setLoading(true);
            await receiptService.requestReview(teamId, receiptId, {
                status: action === 'approve' ? 'APPROVE' : 'REJECT',
                rejectReason: action === 'reject' ? rejectReason : undefined,
            });
            const updated = await receiptService.getReceiptDetail(teamId, receiptId);
            setDetail(updated);
            Alert.alert("완료", action === 'approve' ? "승인되었습니다." : "거절되었습니다.");
        } catch (err) {
            console.error("검토 처리 실패:", err);
            Alert.alert("오류", "처리에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#7242E2', '#B49BF0', '#FFFFFF']}
            start={{x:0, y:0}}
            end={{x:0, y:0.97}}
            style={styles.gradientContainer}
        >

            {loading && (
                <ActivityIndicator style={{marginTop: 20}} color="#FFFFFF" />
            )}

            <View style={styles.navContainer}>
                <TouchableOpacity style={styles.backButton}
                onPress={() => navigation.goBack()}>
                    <Image source={require("../../../assets/img/backIcon.png")}
                    style={styles.backIconStyle} />
                </TouchableOpacity>
                <BoldText style={styles.pageName}>영수증 승인 요청</BoldText> 
            </View>

            <View style={styles.topContainer}>
                <View style={styles.container}>
                        {stateConfig.icon && (
                            <Image source={stateConfig.icon}
                            style={styles.stateIcon} />
                        )}

                        <SemiBoldText style={styles.stateMessage}>{stateConfig.message}</SemiBoldText>
                        {statusLabel === "거절" && (
                            <RegularText style={styles.refusalReason}>
                                {stateConfig.reason || detail.rejectReason}
                            </RegularText>
                        )}
                        <View style={styles.dashedLine} />

                        <View style={styles.receiptDetailCard}>
                            <View style={styles.receiptInfoLeft}>
                                <SemiBoldText style={styles.rightText}>가맹점</SemiBoldText>
                                <SemiBoldText style={styles.rightText}>결제금액</SemiBoldText>
                            </View>

                            <View style={styles.receiptInfoRight}>
                                <SemiBoldText style={styles.leftText}>{detail.storeName || detail.place}</SemiBoldText>
                                <SemiBoldText style={styles.amountText}>{(Number(detail.amount) || 0).toLocaleString()}원</SemiBoldText>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.receiptDetailCard}>
                            <View style={styles.receiptInfoLeft}>
                                <SemiBoldText style={styles.rightText}>결제일시</SemiBoldText>
                                <SemiBoldText style={styles.rightText}>결제카드</SemiBoldText>
                                <SemiBoldText style={styles.rightText}>게시자</SemiBoldText>
                            </View>

                            <View style={styles.receiptInfoRight}>
                                <SemiBoldText style={styles.leftText}>{detail.transactionDate || detail.date}</SemiBoldText>
                                <SemiBoldText style={styles.leftText}>{detail.card}</SemiBoldText>
                                <SemiBoldText style={styles.leftText}>{detail.author || detail.authorName || detail.uploaderName}</SemiBoldText>
                            </View>
                        </View>

                        <View style={styles.memoCard}>
                            <RegularText style={styles.descText}>{detail.memo || detail.desc}</RegularText>
                        </View>

                        {detail.imageUrl || detail.Postimage ? (
                            <Image
                                source={
                                    detail.imageUrl
                                        ? { uri: detail.imageUrl }
                                        : detail.Postimage
                                }
                                style={styles.receiptImage}
                            />
                        ) : null}
                    </View>

                    {isAdmin && (
                        <View style={styles.adminActions}>
                            <TouchableOpacity style={styles.adminButton} onPress={() => handleReview('approve')} disabled={loading}>
                                <BoldText style={styles.adminButtonText}>승인</BoldText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.adminButton} onPress={() => handleReview('reject')} disabled={loading}>
                                <BoldText style={styles.adminButtonText}>거절</BoldText>
                            </TouchableOpacity>
                            <TextInput
                                placeholder="거절 사유를 입력하세요"
                                placeholderTextColor="#ADADAD"
                                value={rejectReason}
                                onChangeText={setRejectReason}
                                style={styles.rejectInput}
                            />
                        </View>
                    )}
                </View>
        </LinearGradient>
    )
}

export default ReceiptDetail;

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        width: 322,
        height: 518,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    }, 
    navContainer: {
        marginTop: 80,
        flexDirection: "row",
        marginBottom: 50,
    },
    backIconStyle: {
        width: 37,
        height: 37,
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: "flex-start",
        position: "absolute",
        left: 16,
        alignItems: "center",
        zIndex: 10,
    },
    pageName: {
        fontSize: 27,
        color: "#FFFFFF",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        top: 2.7,
    },
    gradientContainer: {
        flex: 1
    },
    topContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    dashedLine: {
        width: "80%",
        borderBottomWidth: 1,
        borderColor: "#B5B2B2",
        borderStyle: "dashed",
    },
    stateIcon: {
        width: 58,
        height: 58,
        marginBottom: 23,
    },
    stateMessage: {
        color: "#3F5A6F",
        fontSize: 24,
        marginBottom: 15,
    },
    receiptDetailCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 15,
        paddingHorizontal: 35,
        marginBottom: 10,
        width: "100%"
    },
    receiptInfoLeft: {
        flexDirection: "column",
    },
    receiptInfoRight: {
        alignItems: "flex-end",
    },
    rightText: {
        color: "#3F5A6F",
        fontSize: 14,
        marginBottom: 5,
    },
    leftText: {
        color: "#B5B2B2",
        fontSize: 14,
        marginBottom: 5,
    },
    amountText: {
        color: "#7242E2",
        fontSize: 14,
        marginBottom: 5,
    },
    divider: {
        borderWidth: 0.5,
        borderColor: "#B5B2B2",
        borderRadius: 0.5,
        width: "80%",
        marginTop: -10,
    },
    memoCard: {
        borderWidth: 1,
        borderColor: "#B5B2B2",
        borderRadius: 20,
        // paddingHorizontal: 65,
        // paddingVertical: 23,
        marginTop: 35,
        width: 264,
        height: 63,
        justifyContent: "center",
        alignItems: "center",
    },
    descText: {
        color: "#B5B2B2",
        fontSize: 18,
        fontWeight: "600"
    },
    refusalReason: {
        color: "#FF0000",
        marginBottom: 20,
        fontSize: 14,
    },
    receiptImage: {
        width: 240,
        height: 180,
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#B5B2B2",
    },
    adminActions: {
        marginTop: 16,
        gap: 10,
        width: "100%",
        alignItems: "center",
    },
    adminButton: {
        backgroundColor: "#7242E2",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 200,
        alignItems: "center",
    },
    adminButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
    },
    rejectInput: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#B5B2B2",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#3E247C",
    },

})
