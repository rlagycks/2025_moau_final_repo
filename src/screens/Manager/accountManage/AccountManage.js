import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';

const mockGroups = {
    1: {
    members: [
      { id: '1', name: '김효찬', joinDate: '2025-06-01', paid: false },
      { id: '2', name: '고하늘', joinDate: '2025-06-01', paid: false },
      { id: '3', name: '임예준', joinDate: '2025-05-31', paid: false },
      { id: '4', name: '국태양', joinDate: '2025-05-15', paid: false },
      { id: '5', name: '김종혁', joinDate: '2025-05-15', paid: false },
      { id: '6', name: '이승빈', joinDate: '2025-05-15', paid: false },
    ],
    selectedCycle: "3months",
    currentPayDate: "2025년 12월",
    payHistory: {
      '3months': [
        { period: '2025년 9월', unpaidCount: 1 },
        { period: '2025년 6월', unpaidCount: 2 },
        { period: '2025년 3월', unpaidCount: 5 },
        { period: '2024년 12월', unpaidCount: 2 },
      ],
    },
  },
  2: {
    members: [
      { id: '1', name: '국태양', joinDate: '2025-06-01', paid: false },
      { id: '2', name: '임예준', joinDate: '2025-06-01', paid: false },
      { id: '3', name: '이수빈', joinDate: '2025-06-01', paid: false },
    ],
    selectedCycle: "quarterly",
    currentPayDate: "2026년 1분기",
    payHistory: {
      quarterly: [
        { period: '2025년 2분기', unpaidCount: 1 },
        { period: '2025년 1분기', unpaidCount: 2 },
      ],
    },
  },
  3: {
    members: [
      { id: '1', name: '국태양', joinDate: '2025-06-01', paid: false },
      { id: '2', name: '임예준', joinDate: '2025-06-01', paid: false },
      { id: '3', name: '이수빈', joinDate: '2025-06-01', paid: false },
    ],
    selectedCycle: null,
    payHistory: {
    },
  },
};

const AccountManage = ({groupId = 1, navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);

    // 날짜 모달창 선택시 바뀌는 상태
    const [currentDate, setCurrentDate] = useState(mockGroups[groupId].currentPayDate);
    const [selectedHistory, setSelectedHistory] = useState(null);

    // 현재 렌더링되는 멤버 리스트 (납부/미납부)
    const [memberState, setMemberState] = useState(mockGroups[groupId].members);

    // 날짜별 납부 상태 저장
    const [paymentRecords, setPaymentRecords] = useState({});
    

    const currentGroup = mockGroups[groupId];

    //  선택한 회비 주기 없을 경우 띄우기
    if (!currentGroup || !currentGroup.selectedCycle) {
        return (
            <View style={styles.center}>
                <SemiBoldText style={styles.noticeText}>선택된 회비 주기가 없어요!</SemiBoldText>
                <TouchableOpacity style={styles.selectBtn}
                onPress={() => navigation.navigate("GroupManage")}>
                    <SemiBoldText style={styles.selectButtonText}>회비 주기 선택</SemiBoldText>
                </TouchableOpacity>
            </View>
        );
    }

    const {selectedCycle, payHistory} = currentGroup;

    const historyData = payHistory[selectedCycle] || [];

    // 납부/미납부
    const togglePaid = (id) => {
      const updated = memberState.map(member => 
        member.id === id ? {...member, paid: !member.paid} : member
      );
      setMemberState(updated);

      // 날짜별 상태 저장
      setPaymentRecords((prev) => ({
        ...prev,
        [currentDate]: updated,
      }))
    }

    const unPaidMembers = memberState.filter(m => !m.paid);
    const paidMembers = memberState.filter(m => m.paid);

    // 날짜 선택했을 때 처리
    const handleSelectHistory = (item) => {
      setCurrentDate(item.period);
      setModalVisible(false);
      setSelectedHistory(item);

      // 기존에 저장된 기록 있으면 그대로 가져옴
      if (paymentRecords[item.period]) {
        setMemberState(paymentRecords[item.period]);
      } else {
        // 없으면 false로!!!
        setMemberState(prev => prev.map(m => ({...m, paid: false})));
      }
    }

    const handleResetToCurrent = () => {
      const now = currentGroup.currentPayDate;

      setCurrentDate(now);
      setModalVisible(false);

      if (paymentRecords[now]) {
        setMemberState(paymentRecords[now]);
      } else {
        setMemberState(currentGroup.members.map(m => ({...m, paid:false})));
      }
    }

    const renderMember = ({item}) => (
        <View style={styles.memberBox}>
            <View style={styles.memberInfo}>
                <SemiBoldText style={styles.memberName}>{item.name}</SemiBoldText>
                <SemiBoldText style={styles.joinDate}>가입일자: {item.joinDate}</SemiBoldText>
            </View>

            <TouchableOpacity style={styles.checkButton}
            onPress={() => togglePaid(item.id)}>
                <Image
                  source={
                    item.paid
                      ? require("../../../assets/img/noticeCheckPurpleIcon.png")
                      : require("../../../assets/img/noticeVoteCheckIcon.png")
                  }
                  style={styles.checkIcon}
                />
            </TouchableOpacity>
        </View>
    );

    const renderHistoryItem = ({item}) => (
        <View style={styles.historyItem}>
            <SemiBoldText style={styles.historyPeriod}>{item.period}</SemiBoldText>
            <SemiBoldText style={styles.historyUnpaid}>미납자 {item.unpaidCount}명</SemiBoldText>

          <TouchableOpacity
            style={styles.historyDetailButton}
            onPress={() => handleSelectHistory(item)}
          >
            <SemiBoldText style={styles.historyDetailText}>내역 확인</SemiBoldText>
          </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
          <ManagePageNavHeader pageName="회비 관리" navigation={navigation} />
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
          >
            <SemiBoldText style={styles.dropdownButtonText}>
              {currentDate}
            </SemiBoldText>
            <Image source={require("../../../assets/img/dropdownPurpleIcon.png")}
            style={styles.dropdownIcon} />
          </TouchableOpacity>

            <ScrollView>

              <SemiBoldText style={styles.sectionTitle}>납부 미완료</SemiBoldText>

              {unPaidMembers.length === 0 ? (
                <SemiBoldText style={styles.sectionText}>
                  미납부한 인원이 없습니다.
                </SemiBoldText>
              ) : (
                <FlatList data={unPaidMembers}
                renderItem={renderMember}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                />
              )}
              <SemiBoldText style={styles.sectionTitle}>납부 완료</SemiBoldText>
              {paidMembers.length === 0 ? (
                <SemiBoldText style={styles.sectionText}>
                  납부한 인원이 없습니다
                </SemiBoldText>
              ) : (
                  <FlatList data={paidMembers}
                  renderItem={renderMember}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  />
              )}
                
                <Modal visible={modalVisible} transparent animationType='fade'>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <BoldText style={styles.modalTitle}>
                          {selectedCycle === 'quarterly' ? '분기 선택' : '날짜 선택'}
                        </BoldText>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Image source={require("../../../assets/img/disabledIcon.png")}
                          style={styles.disabledIcon} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.currentBadgeWrapper}
                      onPress={handleResetToCurrent}>
                        <View style={styles.badge}>
                          <SemiBoldText style={styles.badgeText}>진행 중</SemiBoldText>
                          <SemiBoldText style={styles.currentBadgeDate}>
                            {currentGroup.currentPayDate}
                          </SemiBoldText>
                        </View>
                      </TouchableOpacity>

                      <FlatList
                        data={historyData}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => item.period}
                      />
                    </View>
                  </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default AccountManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  divider: {
    backgroundColor: "#EFEFEF",
    width: "100%",
    height: 6,
    marginVertical: 15,
  },

  // 회비 선택 안 한 그룹에게 띄우는 메시지
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noticeText: {
    fontSize: 28,
    color: "#ADADAD",
    marginBottom: 35,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: "#7242E2",
    width: 277,
    height: 62,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 20,
    marginVertical: 30,

  },
  selectButtonText: {
    fontSize: 24,
    color: "#7242E2",
  },
  dropdownButton: {
    marginTop: 1,
    marginLeft: 30,
    backgroundColor: "#EEE7FF",
    paddingHorizontal: 15,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    gap: 7,
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#3E247C",
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },

  sectionTitle: {
    fontSize: 14,
    color: "#808080",
    marginLeft: 40,
    marginBottom: 10,
    marginTop: 25,
  },
  sectionText: {
    fontSize: 15,
    color: "#3E247C",
    marginLeft: 40,
    paddingBottom: 25,
  },
  memberBox: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#B5B2B2",
    borderRadius: 15,
    padding: 26,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: "center",
  },
  checkIcon: {
    width: 24,
    height: 24,
    bottom: 3,
  },
  memberName: {
    fontSize: 17,
    color: "#3E247C",
    marginBottom: 3,
  },
  joinDate: {
    fontSize: 13,
    color: "#B5B2B2"
  },

  currentBadgeWrapper: {
   flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#B5B2B2",
    borderRadius: 15,
    padding: 23,
    justifyContent: 'space-between',
    alignItems: "center",
  },
  badgeText: {
    color: "#7242E2",
    fontSize: 14,
    // backgroundColor: "#EEE7FF",
    borderWidth: 1,
    borderColor: "#7242E2",
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  currentBadgeDate: {
    fontSize: 15,
    color: "#3E247C",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: 'center',
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: "#7242E2",
  },
  disabledIcon: {
    width: 30,
    height: 30,
  },
  historyItem: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#B5B2B2",
    borderRadius: 15,
    padding: 23,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: "center",

  },
  historyPeriod: {
    fontSize: 16,
    color: "#3E247C",
  },
  historyUnpaid: {
    fontSize: 13,
    color: "#B5B2B2",
  },
  historyDetailButton: {
    backgroundColor: "#EEE7FF",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
  },
  historyDetailText: {
    fontSize: 13,
    color: "#3E247C"
  },
  cancelBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#EEE7FF",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#7242E2",
    fontSize: 16,
  },
})