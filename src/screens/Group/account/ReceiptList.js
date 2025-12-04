import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, RefreshControl } from 'react-native';
import SemiBoldText from "../../../components/customText/SemiBoldText";
import PageNavHeader from "../../../components/nav/PageNavHeader";
import * as receiptService from "../../../services/receiptService";

const ReceiptList = ({navigation, route}) => {
    const teamId = route.params?.groupId || route.params?.teamId;
    const groupId = teamId;
    const isAdmin = route.params?.isAdmin ?? false;
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadReceipts = async () => {
        if (!teamId) return;
        setLoading(true);
        try {
            const data = await receiptService.getReceipts(teamId);
            const list = Array.isArray(data?.content)
                ? data.content
                : Array.isArray(data)
                ? data
                : [];
            setReceipts(list);
        } catch (err) {
            console.error("영수증 목록 조회 실패:", err);
            setReceipts([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadReceipts();
        setRefreshing(false);
    };

    useEffect(() => {
        loadReceipts();
    }, [teamId]);

    const mapState = status => {
        const s = status || "";
        if (s === "APPROVE" || s === "APPROVED") return "승인";
        if (s === "REJECT" || s === "REJECTED") return "거절";
        return "대기";
    };

    const approveReceipts = receipts.filter(r => mapState(r.status || r.state || r.reviewStatus) === "승인");
    const pendingReceipts = receipts.filter(r => mapState(r.status || r.state || r.reviewStatus) === "대기");
    const rejectedReceipts = receipts.filter(r => mapState(r.status || r.state || r.reviewStatus) === "거절");

    const getStateColor = (state) => {
        switch (state) {
            case "승인":
                return "#00A93B";
            case "대기":
                return "#3197DA";
            case "거절":
                return "#D60000";
            default:
                return "#ADADAD";
        }
    }


    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <PageNavHeader pageName="영수증 상세" navigation={navigation} groupId={groupId} />

                {loading && (
                    <ActivityIndicator style={{marginTop: 20}} color="#7242E2" />
                )}
                
                    <SemiBoldText style={[styles.sectionTitle, {color: getStateColor("승인")}]}>승인</SemiBoldText>
                    <View style={styles.receiptListCard}>
                        {approveReceipts.length > 0 ? (
                            approveReceipts.map(receipt => (
                                <TouchableOpacity
                                key={receipt.receiptId || receipt.id}
                                style={styles.receiptCard}
                                onPress={() => navigation.navigate("ReceiptDetail", {groupId: teamId, teamId, receiptId: receipt.receiptId || receipt.id, receipt, isAdmin})}
                                >
                                    {receipt.imageUrl ? (
                                        <Image source={{ uri: receipt.imageUrl }} style={styles.receiptImage} />
                                    ) : null}
                                    <View style={styles.authorCard}>
                                        <SemiBoldText style={styles.authorName}>{receipt.author || receipt.authorName || receipt.uploaderName}</SemiBoldText>
                                        <SemiBoldText style={styles.receiptDesc}>{receipt.memo || receipt.desc || receipt.storeName}</SemiBoldText>
                                        <SemiBoldText style={styles.receiptDate}>{receipt.transactionDate || receipt.date}</SemiBoldText>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <SemiBoldText style={styles.emptyText}>업로드된 영수증이 없습니다</SemiBoldText>
                        )}
                    </View>

                
                    <SemiBoldText style={[styles.sectionTitle, {color: getStateColor("대기")}]}>대기</SemiBoldText>
                    <View style={styles.receiptListCard}>
                        {pendingReceipts.length > 0 ? (
                            pendingReceipts.map(receipt => (
                                <TouchableOpacity key={receipt.receiptId || receipt.id}
                                style={styles.receiptCard}
                                onPress={() => navigation.navigate("ReceiptDetail", {groupId: teamId, teamId, receiptId: receipt.receiptId || receipt.id, receipt, isAdmin})}
                                >
                                    {receipt.imageUrl ? (
                                        <Image source={{ uri: receipt.imageUrl }} style={styles.receiptImage} />
                                    ) : null}
                                    <View style={styles.authorCard}>
                                        <SemiBoldText style={styles.authorName}>{receipt.author || receipt.authorName || receipt.uploaderName}</SemiBoldText>
                                        <SemiBoldText style={styles.receiptDesc}>{receipt.memo || receipt.desc || receipt.storeName}</SemiBoldText>
                                        <SemiBoldText style={styles.receiptDate}>{receipt.transactionDate || receipt.date}</SemiBoldText>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <SemiBoldText style={styles.emptyText}>업로드된 영수증이 없습니다</SemiBoldText>
                        )}
                    </View>
                

                
                    <SemiBoldText style={[styles.sectionTitle, {color: getStateColor("거절")}]}>거절</SemiBoldText>
                    <View style={styles.receiptListCard}>
                        {rejectedReceipts.length > 0 ? (
                        rejectedReceipts.map(receipt => (
                            <TouchableOpacity key={receipt.receiptId || receipt.id}
                            style={styles.receiptCard}
                            onPress={() => navigation.navigate("ReceiptDetail", {groupId: teamId, teamId, receiptId: receipt.receiptId || receipt.id, receipt, isAdmin})}
                            >
                                {receipt.imageUrl ? (
                                    <Image source={{ uri: receipt.imageUrl }} style={styles.receiptImage} />
                                ) : null}
                                <View style={styles.authorCard}>
                                    <SemiBoldText style={styles.authorName}>{receipt.author || receipt.authorName || receipt.uploaderName}</SemiBoldText>
                                    <SemiBoldText style={styles.receiptDesc}>{receipt.memo || receipt.desc || receipt.storeName}</SemiBoldText>
                                    <SemiBoldText style={styles.receiptDate}>{receipt.transactionDate || receipt.date}</SemiBoldText>
                                </View>
                            </TouchableOpacity>
                        ))
                        ) : (
                            <SemiBoldText style={styles.emptyText}>업로드된 영수증이 없습니다</SemiBoldText>
                        )}
                    </View>
                
            </ScrollView>
        </View>
    )
}

export default ReceiptList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    sectionTitle: {
        fontSize: 17,
        marginHorizontal: 40,
        marginVertical: 20,
    },
    receiptListCard: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    receiptSection: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 25,
        paddingVertical: 10,
        justifyContent: "center",
    },
    receiptCard: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginBottom: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowOffset: {width: 0, height: 4},
        elevation: 4,
        width: "85%",
    },
    receiptImage: {
        width: 110,
        height: 91,
        borderWidth: 1.2,
        borderColor: "#ADADAD",
        borderRadius: 9,
    },
    authorCard: {
        marginLeft: 20,
    },
    authorName: {
        color: "#3E247C",
        fontSize: 17,
        marginBottom: 3,
    },
    receiptDesc: {
        color: "#ADADAD",
        fontSize: 14,
        marginBottom: 3,
    },
    receiptDate: {
        color: "#ADADAD",
        fontSize: 12,
    },
    emptyText: {
        color: "#ADADAD",
        width: "85%",
        paddingHorizontal: 10,
        marginBottom: 15,
    },

    // nav bar
    navContainer: {
        justifyContent: 'flex-end',
        alignItems: "center",
        flexDirection: "row",
        padding: 16,
        marginTop: 65,
    },
    backIconStyle: {
        width: 37,
        height: 37,
    },
    gotoIconStyle: {
        width: 23,
        height: 23,
        marginRight: 10,
        marginLeft: 5
    },
    mngIconStyle: {
        width: 23,
        height: 23,
        marginRight: 10,
    },
    pageName: {
        fontSize: 27,
        color: "#7242E2",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
    },
    iconGroup: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: "flex-start",
        position: "absolute",
        left: 16,
        top: 9,
        alignItems: "center",
        zIndex: 10,
    }
})
