import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as duesService from '../../../services/duesService';

const statusToPaid = status =>
  status === 'PAID' || status === 'paid' || status === true;

const generateRecentMonths = (count = 6) => {
  const now = dayjs();
  return Array.from({ length: count }, (_, idx) => {
    const date = now.subtract(idx, 'month');
    return {
      label: date.format('YYYY년 MM월'),
      year: date.year(),
      month: date.month() + 1,
    };
  });
};

const AccountManage = ({ navigation }) => {
    const route = useRoute();
    const groupId = route.params?.groupId;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1);
    const [currentDateLabel, setCurrentDateLabel] = useState(dayjs().format('YYYY년 MM월'));
    const [memberState, setMemberState] = useState([]);
    const [duesInfo, setDuesInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasCycle, setHasCycle] = useState(true);

    const historyData = useMemo(() => generateRecentMonths(6), []);

    const fetchDues = async (year, month) => {
      if (!groupId) return;
      try {
        setLoading(true);
        const data = await duesService.getDuesStatus(groupId, year, month);
        if (!data || data.duesAmount === undefined) {
          setHasCycle(false);
          setMemberState([]);
          setDuesInfo(null);
          return;
        }
        setHasCycle(true);
        setDuesInfo({
          currentCycle: data.currentCycle,
          duesAmount: data.duesAmount,
          totalMembers: data.totalMembers,
          paidCount: data.paidCount,
        });
        setMemberState(
          (data.members || []).map(m => ({
            id: m.userId ?? m.id,
            name: m.nickname || m.name,
            status: m.status,
            paid: statusToPaid(m.status),
            joinDate: m.joinDate || '',
          })),
        );
      } catch (err) {
        console.error('회비 현황 조회 실패:', err);
        Alert.alert('오류', '회비 현황을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchDues(currentYear, currentMonth);
    }, [groupId]);

    // 납부/미납부
    const togglePaid = async (member) => {
      if (!groupId) return;
      const nextPaid = !member.paid;
      try {
        await duesService.updateDuesStatus(groupId, {
          targetUserId: member.id,
          year: currentYear,
          month: currentMonth,
          status: nextPaid ? 'PAID' : 'UNPAID',
        });
        setMemberState(prev =>
          prev.map(m => (m.id === member.id ? { ...m, paid: nextPaid, status: nextPaid ? 'PAID' : 'UNPAID' } : m)),
        );
      } catch (err) {
        console.error('납부 상태 변경 실패:', err);
        Alert.alert('오류', '납부 상태 변경에 실패했습니다.');
      }
    };

    const unPaidMembers = memberState.filter(m => !m.paid);
    const paidMembers = memberState.filter(m => m.paid);

    // 날짜 선택했을 때 처리
    const handleSelectHistory = (item) => {
      setCurrentYear(item.year);
      setCurrentMonth(item.month);
      setCurrentDateLabel(item.label);
      setModalVisible(false);
      fetchDues(item.year, item.month);
    };

    const handleResetToCurrent = () => {
      const now = dayjs();
      const label = now.format('YYYY년 MM월');
      setCurrentYear(now.year());
      setCurrentMonth(now.month() + 1);
      setCurrentDateLabel(label);
      setModalVisible(false);
      fetchDues(now.year(), now.month() + 1);
    };

    const renderMember = ({item}) => (
        <View style={styles.memberBox}>
            <View style={styles.memberInfo}>
                <SemiBoldText style={styles.memberName}>{item.name}</SemiBoldText>
                {item.joinDate ? (
                  <SemiBoldText style={styles.joinDate}>가입일자: {item.joinDate}</SemiBoldText>
                ) : null}
            </View>

            <TouchableOpacity style={styles.checkButton}
            onPress={() => togglePaid(item)}>
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
            <SemiBoldText style={styles.historyPeriod}>{item.label}</SemiBoldText>
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
              {currentDateLabel}
            </SemiBoldText>
            <Image source={require("../../../assets/img/dropdownPurpleIcon.png")}
            style={styles.dropdownIcon} />
          </TouchableOpacity>

            <ScrollView>
              {loading && (
                <ActivityIndicator style={{marginTop: 20}} color="#7242E2" />
              )}

              {!hasCycle && !loading && (
                <View style={styles.center}>
                  <SemiBoldText style={styles.noticeText}>선택된 회비 주기가 없어요!</SemiBoldText>
                  <TouchableOpacity style={styles.selectBtn}
                  onPress={() => navigation.navigate("GroupManage")}>
                      <SemiBoldText style={styles.selectButtonText}>회비 주기 선택</SemiBoldText>
                  </TouchableOpacity>
                </View>
              )}

              {hasCycle && (
              <>
              <SemiBoldText style={styles.sectionTitle}>납부 미완료</SemiBoldText>
              {unPaidMembers.length === 0 ? (
                <SemiBoldText style={styles.sectionText}>
                  미납부한 인원이 없습니다.
                </SemiBoldText>
              ) : (
                <FlatList data={unPaidMembers}
                renderItem={renderMember}
                keyExtractor={item => String(item.id)}
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
                  keyExtractor={item => String(item.id)}
                  scrollEnabled={false}
                  />
              )}
              </>
              )}
                
                <Modal visible={modalVisible} transparent animationType='fade'>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <BoldText style={styles.modalTitle}>
                          {'날짜 선택'}
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
                            {dayjs().format('YYYY년 MM월')}
                          </SemiBoldText>
                        </View>
                      </TouchableOpacity>

                      <FlatList
                        data={historyData}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => item.label}
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
