import { Image, StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import BoldText from '../../../components/customText/BoldText';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import * as receiptService from '../../../services/receiptService';

const RejectReceipt = ({navigation, route}) => {
    const { teamId, receiptId, reviewId } = route.params;
    const [rejectReason, setRejectReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReject = async () => {
      if (!rejectReason.trim()) {
        Alert.alert('알림', '거절 사유를 입력해 주세요.');
        return;
      }
      try {
        setLoading(true);
        await receiptService.rejectReceipt(teamId, reviewId, rejectReason.trim());
        Alert.alert('완료', '거절되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } catch (err) {
        console.error('영수증 거절 실패:', err);
        Alert.alert('오류', '거절 처리에 실패했습니다.');
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

      <View style={styles.navContainer}>
          <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.goBack()}>
              <Image source={require("../../../assets/img/backIcon.png")}
              style={styles.backIconStyle} />
          </TouchableOpacity>
          <BoldText style={styles.pageName}>영수증 확인</BoldText> 
      </View>

      <KeyboardAvoidingView
          style={{flex:1}}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView 
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            >

              <View style={styles.container}>

                <View style={styles.centerSection}>
                  <Image 
                    source={require("../../../assets/img/rejectIcon.png")} 
                    style={styles.checkIcon} 
                  />
                  <SemiBoldText style={styles.checkText}>거절된 영수증</SemiBoldText>
                  <View style={styles.dashedLine} />
                </View>

                <View style={styles.memoCard}>
                  <TextInput style={styles.inputText}
                  placeholder='거절 사유를 작성해 주세요'
                  placeholderTextColor="#ADADAD"
                  numberOfLines={2}
                  value={rejectReason}
                  onChangeText={setRejectReason} />
                </View>
              </View>

              <View style={styles.buttonBox}>
                <TouchableOpacity style={[styles.buttonStyle, loading && {opacity:0.6}]} onPress={handleReject} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <BoldText style={styles.buttonText}>완료</BoldText>
                  )}
                </TouchableOpacity>
              </View>
        </ScrollView>
      </KeyboardAvoidingView>

      
    </LinearGradient>
  )
}

export default RejectReceipt;


const styles = StyleSheet.create({

  gradientContainer: {
    flex: 1,
  },

//   main container
  container: {
    width: 322,
    height: 518,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    marginTop: 30,
    paddingVertical: 35,
    paddingHorizontal: 25,
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
  centerSection: {
    alignItems: "center",
    // marginBottom: 20,
  },
  checkIcon: {
    width: 58,
    height: 58,
    marginBottom: 15,
  },
  checkText: {
    color: "#FF0000",
    fontSize: 24,
    marginVertical: 10,
  },

  dashedLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#B5B2B2",
    borderStyle: "dashed",
    marginTop: 12,
  },

//   row section

  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  leftColumn: {
    flexDirection: "column",
  },

  rightColumn: {
    flexDirection: "column",
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
    width: "100%",
    marginTop: 15,
  },
  memoCard: {
    borderWidth: 1,
    borderColor: "#B5B2B2",
    borderRadius: 20,
    marginTop: 40,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  inputText: {
    fontFamily: "Freesentation-6SemiBold",
    fontSize: 16,
    color: "#ADADAD"
  },
  buttonBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  buttonStyle: {
    backgroundColor: "#7242E2",
    width: 316,
    height: 61,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 23,
  }
});
