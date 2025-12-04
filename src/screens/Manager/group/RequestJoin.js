import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader'
import SemiBoldText from '../../../components/customText/SemiBoldText'
import { useRoute } from '@react-navigation/native'
import {
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from '../../../services/groupService';

const RequestJoin = ({navigation}) => {
  const route = useRoute();
  const teamId = route.params?.teamId;

  const [reqJoin, setReqJoin] = useState([]);
  const [loading, setLoading] = useState(false);

//   날짜별로 그룹화하기
  const groupedByDate = reqJoin.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = [];
    acc[cur.date].push(cur);
    return acc;
  }, {});

  const loadRequests = async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const list = await getJoinRequests(teamId);
      const mapped = (list || []).map(item => ({
        id: item.requestId ?? item.id,
        name: item.nickname || item.name,
        date: item.requestDate || item.date || item.createdAt,
        userId: item.userId,
      }));
      setReqJoin(mapped);
    } catch (err) {
      console.error('가입 요청 불러오기 실패:', err);
      Alert.alert('오류', '가입 요청을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [teamId]);

  const handleApprove = async (id) => {
    if (!teamId || !id) return;
    try {
      await approveJoinRequest(teamId, id);
      setReqJoin(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('가입 승인 실패:', err);
      Alert.alert('오류', '가입 승인에 실패했습니다.');
    }
  };

  const handleReject = async (id) => {
    if (!teamId || !id) return;
    try {
      await rejectJoinRequest(teamId, id);
      setReqJoin(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('가입 거절 실패:', err);
      Alert.alert('오류', '가입 거절에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
       
        <ManagePageNavHeader pageName="가입 승인" navigation={navigation} />
        <View style={styles.divider} />
        <View style={styles.subTitle}>
          <SemiBoldText style={styles.recentReqJoin}>최근 승인 요청</SemiBoldText>
          <SemiBoldText style={styles.recentReqCount}>{reqJoin.length}</SemiBoldText>
        </View>

        {loading && (
          <ActivityIndicator style={{ marginTop: 20 }} color="#7242E2" />
        )}

        <ScrollView style={{marginTop: 20}}>
            {Object.keys(groupedByDate).map(date => (
                <View key={date} style={styles.requestListSection}>
                    <SemiBoldText style={styles.dateTitle}>{date}</SemiBoldText>

                    {groupedByDate[date].map(member => (
                        <View key={member.id} style={styles.memberBox}>
                            <SemiBoldText style={styles.memberName}>{member.name}</SemiBoldText>

                            {member.approved ? (
                                <View style={styles.approvedBox}>
                                    <SemiBoldText style={styles.approvedByText}>{member.approvedBy}</SemiBoldText>
                                    <SemiBoldText style={styles.approveText}>승인 완료</SemiBoldText>
                                </View>
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.approveButton}
                                    onPress={() => handleApprove(member.id)}>
                                        <SemiBoldText style={styles.approveBtnText}>승인</SemiBoldText>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.rejectButton}
                                    onPress={() => handleReject(member.id)}>
                                        <SemiBoldText style={styles.rejectBtnText}>거부</SemiBoldText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    </View>
  )
}

export default RequestJoin

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
  subTitle: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: "#EEE7FF",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },
  recentReqJoin: {
    fontSize: 17,
    color: "#3E247C"
  },
  recentReqCount: {
    fontSize: 17,
    color: "#7242E2",
  },
  requestListSection: {
    padding: 20,    
  },
  dateTitle: {
    fontSize: 13,
    color: "#B5B2B2",
    marginLeft: 10,
    marginBottom: 5,
  },
  memberBox: {
    borderWidth: 1,
    borderColor: "#B5B2B2",
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 5,
  },
  memberName: {
    fontSize: 16,
    color: "#3E247C"
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  approveButton: {
    backgroundColor: "#EEE7FF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  approveBtnText: {
    fontSize: 13,
    color: "#3E247C",
  },
  rejectButton: {
    backgroundColor: "#FFE7E7",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rejectBtnText: {
    fontSize: 13,
    color: "#D60000",
  },
  approvedBox: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  approvedByText: {
    fontSize: 13,
    color: "#7242E2",
  },
  approveText: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 13,
    color: "#B5B2B2",
  }
})
