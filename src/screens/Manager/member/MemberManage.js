import { ScrollView, StyleSheet, TouchableOpacity, View, Modal, Image } from 'react-native'
import React, { useState } from 'react';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';

const mockMembers = [
    { id:1, name: "국태양", isAdmin: true },
    { id:2, name: "고하늘", isAdmin: false },
    { id:3, name: "김효찬", isAdmin: false },
    { id:4, name: "임예준", isAdmin: true },
    { id:5, name: "김종혁", isAdmin: true },
    { id:6, name: "이승빈", isAdmin: true },
    { id:7, name: "정기찬", isAdmin: false },
  ];

const MemberManage = ({navigation}) => {

  const [members, setMembers] = useState(mockMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedKickMember, setSelectedKickMember] = useState(null);
  const [kickModalVisible, setKickModalVisible] = useState(false);

  const openPermissionModal = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const changePermission = () => {
    if (!selectedMember) return;

    const updated = members.map((m) => 
    m.id === selectedMember.id ? {...m, isAdmin: !m.isAdmin} : m
    );
    setMembers(updated);
    setModalVisible(false);
  };

  const openKickModal = (member) => {
    setSelectedKickMember(member);
    setKickModalVisible(true);
  };

  const kickMember = () => {
    if (!selectedKickMember) return;

    const updated = members.filter((m) => m.id !== selectedKickMember.id);
    setMembers(updated);
    setKickModalVisible(false);
  };
  

  return (
    <View style={styles.container}>
       
        <ManagePageNavHeader pageName="회원 관리" navigation={navigation} />
        <View style={styles.divider} />
        <View style={styles.subTitle}>
          <SemiBoldText style={styles.totalMemberText}>총 멤버</SemiBoldText>
          <SemiBoldText style={styles.memberCount}>{members.length}</SemiBoldText>
        </View>
        

        <ScrollView style={{marginTop: 20, paddingHorizontal: 25}}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberBox}>
              <View style={styles.memberNameSection}>
                <SemiBoldText style={styles.memberName}>{member.name}</SemiBoldText>

                {member.isAdmin && (
                  <View style={styles.adminBadge}>
                    <SemiBoldText style={styles.adminBadgeText}>관리자</SemiBoldText>
                  </View>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.permissionButton}
                onPress={() => openPermissionModal(member)}>
                  <SemiBoldText style={styles.permissionButtonText}>권한 설정</SemiBoldText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.kickButton}
                onPress={() => openKickModal(member)}>
                  <SemiBoldText style={styles.kickText}>퇴출</SemiBoldText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <BoldText style={styles.modalTitle}>권한 설정</BoldText>
                <TouchableOpacity style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}>
                  <Image source={require("../../../assets/img/disabledIcon.png")}
                  style={styles.disabledIcon} />
                </TouchableOpacity>
                
              </View>

              {selectedMember && (
                <>
                  <SemiBoldText style={styles.modalMemberName}>
                    {selectedMember.name}
                  </SemiBoldText>

                  <View style={styles.adminPermissionBox}>
                    <View style={styles.textSection}>
                      <SemiBoldText style={styles.currentPermissionText}>
                        현재 권한:{" "}
                      </SemiBoldText>
                      <View style={styles.currentPermissionBox}>
                        <SemiBoldText style={styles.subText}>
                          {selectedMember.isAdmin ? "관리자" : "그룹원"}
                        </SemiBoldText>
                      </View>
                    </View>
                    

                    <TouchableOpacity style={styles.permissionActionButton}
                    onPress={changePermission}>
                      <SemiBoldText style={styles.permissionActionButtonText}>
                        {selectedMember.isAdmin ? "권한 박탈" : "권한 부여"}
                      </SemiBoldText>
                    </TouchableOpacity>
                  </View>
                  
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal visible={kickModalVisible} transparent animationType='fade'>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <BoldText style={styles.kickTitle}>퇴출 여부 확인</BoldText>

              {selectedKickMember && (
                <SemiBoldText style={styles.kickMessage}>
                  퇴출은 취소가 불가해요{"\n"}
                  {selectedKickMember.name} 님을 퇴출하시겠어요?
                </SemiBoldText>
              )}
              
              <View style={styles.kickButtonRow}>
                <TouchableOpacity style={styles.kickConfirmButton} onPress={kickMember}>
                  <SemiBoldText style={styles.kickConfirmButtonText}>퇴출하기</SemiBoldText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.kickCancelButton}
                onPress={() => setKickModalVisible(false)}>
                  <SemiBoldText style={styles.kickCancelText}>취소</SemiBoldText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  )
}

export default MemberManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 8,
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
    marginLeft: 25,
    marginTop: 10,
  },
  totalMemberText: {
    fontSize: 17,
    color: "#3E247C"
  },
  memberCount: {
    fontSize: 17,
    color: "#7242E2",
  },
  memberBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#B5B2B2",
    borderRadius: 15,
    padding: 26,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: "center",
  },
  memberNameSection: {
    flexDirection: "row",
    gap: 8,
  },
  memberName: {
    fontSize: 19,
    color: "#3E247C",
  },
  adminBadge: {
    borderWidth: 1,
    borderColor: "#7242E2",
    borderRadius: 10,
    // paddingHorizontal: 12,
    // paddingVertical: 3.3,
    width: 45,
    height: 18,
    marginTop: 2.3
  },
  adminBadgeText: {
    fontSize: 12,
    color: "#7242E2",
    textAlign: "center",
    top: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  permissionButton: {
    backgroundColor: "#EEE7FF",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  permissionButtonText: {
    fontSize: 13,
    color: "#3E247C",
  },
  kickButton: {
    backgroundColor: "#FFE7E7",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  kickText: {
    color: "#D60000",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: 'center',
    alignItems: "center",
  },
  modalCard: {
    width:"90%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingVertical: 25,
    // paddingBottom: 60,
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    color: "#7242E2",

  },
  disabledIcon: {
    width: 30,
    height: 30,
  },
  adminPermissionBox: {
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: "#B5B2B2",
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between"
  },
  textSection: {
    flexDirection: "row",
  },
  modalMemberName: {
    fontSize: 20,
    color: "#3E247C",
    marginVertical: 9,
  },
  permissionActionButton: {
    backgroundColor: "#EEE7FF",
    width: 62,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  permissionActionButtonText: {
    fontSize: 13,
    color: "#3E247C"
  },
  currentPermissionText: {
    color: "#B5B2B2",
    fontSize: 15,
    top: 2,
  },
  subText: {
    color: "#B5B2B2",
    fontSize: 15,
    top: 2,
  },
  modalCloseButton: {
    paddingVertical: 8,
  },
  kickTitle: {
    fontSize: 23,
    color: "#FF0000",
    marginBottom: 12,
    textAlign: "center",
  },
  kickMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#ADADAD",
    marginBottom: 25,
    lineHeight: 20,
  },
  kickButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  kickConfirmButton: {
    backgroundColor: "#FFE7E7",
    borderRadius: 15,
    alignItems: "center",
    width: 123,
    height: 34,
    justifyContent: 'center',
  },
  kickConfirmButtonText: {
    fontSize: 18,
    color: "#FF0000",
  },
  kickCancelButton: {
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    alignItems: "center",
    width: 123,
    height: 34,
    justifyContent: 'center',
  },
  kickCancelText: {
    color: "#ADADAD",
    fontSize: 18,
  }
})