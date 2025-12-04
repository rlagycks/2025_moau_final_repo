import React, {useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import { useRoute } from "@react-navigation/native";
import * as bankingService from "../../../services/bankingService";

const RecentTransaction = () => {
    const route = useRoute();
    const { groupId } = route.params;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!groupId) return;
            try {
                setLoading(true);
                const txs = await bankingService.getTransactions(groupId);
                const list = Array.isArray(txs?.content) ? txs.content : Array.isArray(txs) ? txs : [];
                setTransactions(list);
            } catch (err) {
                console.error("거래 내역 조회 실패:", err);
                Alert.alert("오류", "거래 내역을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator color="#7242E2" size="large" />
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.accountSection}>
                <SemiBoldText style={styles.latestAccountText}>거래 내역</SemiBoldText>
                    {transactions.map((item) => (
                        <View key={item.id} style={styles.transactionCard}>
                            <View style={styles.transactionLeft}>
                                <SemiBoldText style={styles.placeText}>{item.description || item.place}</SemiBoldText>
                                <View style={styles.dateTimeContainer}>
                                    <SemiBoldText style={styles.dateText}>{item.transactionDate || item.date}</SemiBoldText>
                                    {item.time && <SemiBoldText style={styles.timeText}>{item.time}</SemiBoldText>}
                                </View>
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
            </View>
        </ScrollView>
        
    )
}

export default RecentTransaction;

const styles = StyleSheet.create({
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
        flex: 1,
    },
    latestAccountText: {
        fontSize: 18,
        color: "#3E247C",
        marginTop: 80,
        marginBottom: 20,
        backgroundColor: "#EEE7FF",
        paddingHorizontal: 19,
        paddingVertical: 6,
        borderRadius: 20,
        width: 100,
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
    dateTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        color: "#ADADAD",
        fontSize: 11.5,
    },
    timeText: {
        color: "#ADADAD",
        fontSize: 11.5,
        marginLeft: 5.5,
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
})
