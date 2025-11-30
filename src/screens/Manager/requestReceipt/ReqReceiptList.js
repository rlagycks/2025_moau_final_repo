import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
import SemiBoldText from '../../../components/customText/SemiBoldText';

const ReqReceiptList = ({navigation, route}) => {
    const {
        groupId,
        receiptList,
        requestCount,
    } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <ManagePageNavHeader pageName="영수증 확인" navigation={navigation} />

        <View style={styles.receiptSection}>
          <SemiBoldText style={styles.textSection}>
            승인 요청된 영수증 {requestCount}
          </SemiBoldText>

          {receiptList.map((receipt) => (
            <TouchableOpacity
              key={receipt.id}
              style={styles.receiptCard}
              onPress={() =>
                navigation.navigate("ReqReceiptDetail", {
                  place: receipt.place,
                  amount: receipt.amount,
                  date: receipt.date,
                  card: receipt.card,
                  author: receipt.author,
                  desc: receipt.desc,
                })
              }
            >
              <Image source={receipt.Postimage} style={styles.receiptImage} />

              <View style={styles.authorCard}>
                <SemiBoldText style={styles.authorName}>
                  {receipt.author}
                </SemiBoldText>
                <SemiBoldText style={styles.receiptDesc}>
                  {receipt.desc}
                </SemiBoldText>
                <SemiBoldText style={styles.receiptDate}>
                  {receipt.date}
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