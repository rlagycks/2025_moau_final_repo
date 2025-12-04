import { Image, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as receiptService from '../../../services/receiptService';

const ReqReceiptList = ({navigation, route}) => {
    const nav = navigation;
    const params = route.params || {};
    const teamId = params.groupId || params.teamId;

    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadReceipts = async () => {
      if (!teamId) return;
      try {
        setLoading(true);
        const data = await receiptService.getReceipts(teamId);
        const list = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        const normalized = list.map(r => ({
          ...r,
          id: r.receiptId || r.id,
          receiptId: r.receiptId || r.id,
          reviewId: r.reviewId,
          imageUrl: r.receiptImageUrl || r.imageUrl,
          author: r.requesterName || r.author || r.authorName || r.uploaderName,
          description: r.description || r.memo || r.desc || r.storeName,
          transactionDate: r.transactionDate || r.date,
          status: r.status || r.reviewStatus || r.state,
        }));
        const waiting = normalized.filter(
          r =>
            r.status === 'WAITING' ||
            r.status === 'PENDING' ||
            !r.status,
        );
        setReceipts(waiting);
      } catch (err) {
        console.error('영수증 대기 목록 조회 실패:', err);
        Alert.alert('오류', '영수증 목록을 불러오지 못했습니다.');
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
      const unsubscribe = nav.addListener('focus', loadReceipts);
      return unsubscribe;
    }, [teamId]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ManagePageNavHeader pageName="영수증 확인" navigation={navigation} />

        <View style={styles.receiptSection}>
          <SemiBoldText style={styles.textSection}>
            승인 요청된 영수증 {receipts.length}
          </SemiBoldText>

          {loading && (
            <ActivityIndicator style={{marginVertical: 10}} color="#7242E2" />
          )}

          {receipts.map((receipt) => (
            <TouchableOpacity
              key={receipt.receiptId || receipt.id}
              style={styles.receiptCard}
              onPress={() =>
                navigation.navigate("ReqReceiptDetail", {
                  teamId,
                  receiptId: receipt.receiptId || receipt.id,
                  reviewId: receipt.reviewId,
                })
              }
            >
              {receipt.imageUrl ? (
                <Image source={{ uri: receipt.imageUrl }} style={styles.receiptImage} />
              ) : null}

              <View style={styles.authorCard}>
                <SemiBoldText style={styles.authorName}>
                  {receipt.author}
                </SemiBoldText>
                <SemiBoldText style={styles.receiptDesc}>
                  {receipt.description}
                </SemiBoldText>
                <SemiBoldText style={styles.receiptDate}>
                  {receipt.transactionDate}
                </SemiBoldText>
              </View>

              <Image
                source={require("../../../assets/img/receiptCheckIcon.png")}
                style={styles.receiptCheck}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReqReceiptList

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  textSection: {
    paddingVertical: 17,
    marginBottom: 7,
    fontSize: 16,
    color: "#7242E2",
    marginLeft: 10,
  },
  receiptSection: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  receiptCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
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
    fontSize: 17,
    color: "#3E247C",
    marginBottom: 3,
  },
  receiptDesc: {
    fontSize: 14,
    color: "#ADADAD",
    marginBottom: 3,
  },
  receiptDate: {
    fontSize: 12,
    color: "#ADADAD",
  },
  receiptCheck: {
    width: 20,
    height: 20,
    marginLeft: 40,
  },
})
