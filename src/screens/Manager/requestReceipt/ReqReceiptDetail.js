import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import BoldText from '../../../components/customText/BoldText';
import SemiBoldText from '../../../components/customText/SemiBoldText';

const ReqReceiptDetail = ({navigation, route}) => {
    const { place, amount, date, card, author, desc } = route.params;

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

      <View style={styles.container}>

        <View style={styles.centerSection}>
          <Image 
            source={require("../../../assets/img/receiptCheckIcon.png")} 
            style={styles.checkIcon} 
          />
          <SemiBoldText style={styles.checkText}>승인 요청된 영수증</SemiBoldText>
          <View style={styles.dashedLine} />
        </View>

        <View style={styles.rowSection}>
          <View style={styles.leftColumn}>
            <SemiBoldText style={styles.rightText}>가맹점</SemiBoldText>
            <SemiBoldText style={styles.rightText}>결제금액</SemiBoldText>
          </View>

          <View style={styles.rightColumn}>
            <SemiBoldText style={styles.leftText}>{place}</SemiBoldText>
            <SemiBoldText style={styles.amountText}>{amount.toLocaleString()}원</SemiBoldText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowSection}>
          <View style={styles.leftColumn}>
            <SemiBoldText style={styles.rightText}>결제일시</SemiBoldText>
            <SemiBoldText style={styles.rightText}>결제카드</SemiBoldText>
            <SemiBoldText style={styles.rightText}>게시자</SemiBoldText>
            <SemiBoldText style={styles.rightText}>메모</SemiBoldText>
          </View>

          <View style={styles.rightColumn}>
            <SemiBoldText style={styles.leftText}>{date}</SemiBoldText>
            <SemiBoldText style={styles.leftText}>{card}</SemiBoldText>
            <SemiBoldText style={styles.leftText}>{author}</SemiBoldText>
            <SemiBoldText style={styles.leftText}>{desc}</SemiBoldText>
          </View>
        </View>
      </View>

      <View style={styles.buttonBox}>
            <TouchableOpacity style={styles.buttonStyle}>
                <BoldText style={styles.buttonText}>승인</BoldText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}
            onPress={() => navigation.navigate("RejectReceipt", {
              place: place,
              amount: amount,
              date: date,
              card: card,
              author: author,
              desc: desc
            })}>
                <BoldText style={styles.buttonText}>거절</BoldText>
            </TouchableOpacity>
        </View>

    </LinearGradient>
  )
}

export default ReqReceiptDetail;


const styles = StyleSheet.create({

  gradientContainer: {
    flex: 1,
  },

//   main container
  container: {
    width: 322,
    height: 457,
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
    color: "#3F5A6F",
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
  buttonBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 80,
  },
  buttonStyle: {
    width: 149,
    height: 61,
    backgroundColor: "#7242E2",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 23,
  }

});
