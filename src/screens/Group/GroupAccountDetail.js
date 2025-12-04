import React, {useState, useEffect} from "react";
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import BoldText from "../../components/customText/BoldText";
import LinearGradient from "react-native-linear-gradient";
import NavBar from "../../components/nav/NavBar";
import SemiBoldText from "../../components/customText/SemiBoldText";
import RegularText from "../../components/customText/RegularText";
import { launchCamera } from "react-native-image-picker";
import * as bankingService from "../../services/bankingService";
import * as receiptService from "../../services/receiptService";

const GroupAccountDetail = ({navigation}) => {
    const route = useRoute();
    const { groupId, groupName } = route.params;

    const [accountInfo, setAccountInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getStateColor = (state) => {
        const val = state || "";
        if (val === "승인" || val === "APPROVE" || val === "APPROVED") return "#00A93B";
        if (val === "거절" || val === "REJECT" || val === "REJECTED") return "#D60000";
        return "#3197DA";
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!groupId) return;
            try {
                setLoading(true);
                const [account, txs, receiptList] = await Promise.all([
                    bankingService.getAccountInfo(groupId),
                    bankingService.getTransactions(groupId),
                    receiptService.getReceipts(groupId),
                ]);

                setAccountInfo(account);
                setTransactions(Array.isArray(txs) ? txs : txs?.content || []);

                const receiptArray = Array.isArray(receiptList?.content)
                    ? receiptList.content
                    : Array.isArray(receiptList)
                    ? receiptList
                    : [];
                const approved = receiptArray.filter(r => {
                    const status = r.status || r.reviewStatus || r.state;
                    return status === "APPROVE" || status === "APPROVED" || status === "승인";
                });
                setReceipts(approved);
            } catch (err) {
                console.error("회계 데이터 조회 실패:", err);
                Alert.alert("오류", "회계 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

        if (!accountInfo) {
            return (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator color="#7242E2" size="large" />
                </View>
            );
        }

    const handleDirectPhoto = async () => {
        try {
            await new Promise(res => setTimeout(res, 120)); // 디버거 멈춤 방지

            const result = await launchCamera({
                mediaType: "photo",
                cameraType: "back",
                saveToPhotos: false,
                quality: 0.8,
            });

            if (result.didCancel) return;

            if (result.errorCode || result.errorMessage) {
                console.log("Camera Error:", result);
                return;
            }

            const photo = result.assets?.[0];
            if (!photo) return;

            // 촬영 후 임시 영수증 데이터 구성
            const newReceipt = {
                place: "가맹점 입력 필요",
                amount: 0,
                date: new Date().toISOString(),
                card: "정보 없음",
                author: "작성자",
                imageUri: photo.uri,
            };

            navigation.navigate("RequestAccept", {
                receipt: newReceipt,
                group: {groupId, groupName}
            });

        } catch (err) {
            console.log("Camera Launch Exception:", err);
        }
    };

    

    return(
        <LinearGradient
                colors={['#7242E2', '#C7B4F3', '#FFFFFF']}
                start={{x:0, y:0.07}}
                end={{x:0, y:0.67}}
                style={styles.gradientContainer}
                >
                   <View style={styles.container}>
                        <ScrollView>
                            <NavBar />
                            <View style={styles.groupAccountContainer}>
                                <Image source={require("../../assets/img/accountingIcon.png")} style={styles.groupImage} />
                                <BoldText style={styles.accountNumText}>{accountInfo.accountNumber}</BoldText>
                                <BoldText style={styles.totalAmountText}>{(Number(accountInfo.balance) || 0).toLocaleString()} 원</BoldText>
                            </View>
                            
                            <View style={styles.divider} />

                            <View style={styles.accountSection}>
                                <SemiBoldText style={styles.latestAccountText}>최근 거래</SemiBoldText>

                                {transactions.slice(0, 5).map((item) => (
                                    <View key={item.id} style={styles.transactionCard}>
                                        <View style={styles.transactionLeft}>
                                            <SemiBoldText style={styles.placeText}>{item.description || item.place}</SemiBoldText>
                                            <SemiBoldText style={styles.dateText}>{item.transactionDate || item.date}</SemiBoldText>
                                        </View>

                                        <View style={styles.transactionRight}>
                                            <SemiBoldText style={styles.amountText}>
                                                {Math.abs(Number(item.amount) || 0).toLocaleString()}원
                                            </SemiBoldText>
                                            <SemiBoldText style={styles.balanceText}>
                                                잔액 {(Number(item.balance) || 0).toLocaleString()}원
                                            </SemiBoldText>
                                        </View>
                                    </View>
                                    
                                ))}
                                    <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={()=> navigation.navigate("RecentTransaction", {groupId, groupName})}
                                    >
                                        <RegularText style={styles.detailText}>
                                            자세히
                                        </RegularText>
                                    </TouchableOpacity>
                            </View>

                            <View style={styles.receiptSection}>
                                <SemiBoldText style={styles.latestAccountText}>업로드된 영수증</SemiBoldText>
                                {receipts.slice(0, 5).map((receipt) => (
                                    <TouchableOpacity
                                    key={receipt.receiptId || receipt.id}
                                    style={styles.receiptCard}
                                    onPress={() =>
                                        navigation.navigate("ReceiptDetail", {groupId, teamId: groupId, receiptId: receipt.receiptId || receipt.id, receipt})
                                    }
                                    >
                                        {receipt.imageUrl ? (
                                            <Image source={{ uri: receipt.imageUrl }}
                                            style={styles.receiptImage} />
                                        ) : null}

                                        <View style={styles.authorCard}>
                                            <SemiBoldText style={styles.authorName}>{receipt.author || receipt.authorName || receipt.uploaderName}</SemiBoldText>
                                            <SemiBoldText style={styles.receiptDesc}>{receipt.memo || receipt.desc || receipt.storeName}</SemiBoldText>
                                            <RegularText style={styles.receiptDate}>{receipt.transactionDate || receipt.date}</RegularText>
                                        </View>
                                        <SemiBoldText style={[styles.stateText, {color: getStateColor(receipt.status || receipt.reviewStatus || receipt.state)}]}>
                                            {receipt.status || receipt.reviewStatus || receipt.state}
                                        </SemiBoldText>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={()=> navigation.navigate("ReceiptList", {groupId, teamId: groupId})}
                                    >
                                        <RegularText style={styles.detailText}>
                                            자세히
                                        </RegularText>
                                    </TouchableOpacity>
                            </View>
                            <View style={styles.buttonSection}>
                                <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={handleDirectPhoto}>
                                    <SemiBoldText style={styles.buttonTextStyle}>영수증 촬영</SemiBoldText>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View> 
        </LinearGradient>
        
    );
};

export default GroupAccountDetail;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    divider: {
        width: "100%",
        height: 6,
        backgroundColor: "#EFEFEF",
        marginTop: 30,
    },
    groupImage: {
        width: 85,
        height: 85,
    },
    groupAccountContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    accountNumText: {
        color: "#EEE7FF",
        fontSize: 15,
        marginTop: 20,
    },
    totalAmountText: {
        fontSize: 35,
        color: "#FFFFFF",
        marginTop: 14,
    },
    accountSection: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 25,
        paddingVertical: 10,
        justifyContent: "center",
    },
    latestAccountText: {
        fontSize: 18,
        color: "#7242E2",
        marginTop: 20,
        marginBottom: 20,
    },
    recentSection: {
        shadowColor: "#000000",
        shadowOffset: {x: 0, y: 4},
        justifyContent: "space-between",
        flexDirection: "row",
    },
    transactionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },
    transactionLeft: {
        flexDirection: "column",
    },
    transactionRight: {
        alignItems: "flex-end",
    },
    placeText: {
        fontSize: 18,
        color: "#3E247C",
        marginBottom: 4,
    },
    dateText: {
        color: "#ADADAD",
        fontSize: 11.5,
    },
    amountText: {
        fontSize: 18,
        color: "#7242E2",
        marginBottom: 4,
    },
    balanceText: {
        color: "#ADADAD",
        fontSize: 11.5,
    },
    detailButton: {
        backgroundColor: "#F1F1F1",
        width: 341,
        height: 26,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        marginBottom: 10,
    },
    detailText: {
        color: "#ADADAD",
        fontSize: 16,
        fontWeight: "600"
    },

    // 영수증 리스트...
    receiptSection: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 25,
        paddingVertical: 10,
        justifyContent: "center",
    },
    receiptCard: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },
    receiptImage: {
        width: 110,
        height: 91,
        borderWidth: 1.2,
        borderColor: "#ADADAD",
        borderRadius: 9,
    },
    authorCard: {
        marginLeft: -20,
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
    stateText: {
        alignSelf: "flex-start",
        fontSize: 16,
    },
    buttonSection: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 40,
    },
    buttonStyle: {
        backgroundColor: "#7242E2",
        width: 316,
        height: 61,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonTextStyle: {
        color: "#FFFFFF",
        fontSize: 25,
    },

    container: {
        marginTop: 60,
    }
})
