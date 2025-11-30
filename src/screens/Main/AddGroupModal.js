// import { StyleSheet, TouchableOpacity, View, Image, TextInput } from 'react-native'
// import React, { useState } from 'react'
// import Modal from 'react-native-modal';
// import SemiBoldText from '../../components/customText/SemiBoldText';

// /**
//  * 
//  * 컴포넌트 모드
//  * 1. select : 그룹 생성하기, 그룹코드 입력
//  * 2. create : 그룹 이름, 그룹 설명 입력, 확인 -> 랜덤 코드 생성 후 createComplete 로 이동
//  * 3. createComplete : 생성된 그룹 코드 표시, 버튼 - 완료
//  * 4. enterCode : 그룹 코드 입력, 입장하기 -> 매니저 페이지로 요청 전달
//  */

// const AddGroupModal = ({visible, onClose, onCreateGroup, onEnterGroup}) => {

//     const [mode, setMode] = useState("select");
//     const [groupName, setGroupName] = useState("");
//     const [groupDesc, setGroupDesc] = useState("");
//     const [groupCode, setGroupCode] = useState("");

//     const resetAll = () => {
//         setMode("select");
//         setGroupName("");
//         setGroupDesc("");
//         setGroupCode("");
//     };

//     const generateRandomCode = () => {
//         const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//         let code = "";
//         for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
//         return code;
//     };

//     const handleCreateConfirm = () => {
//         const newCode = generateRandomCode();
//         setGroupCode(newCode);

//         if (onCreateGroup) {
//             onCreateGroup({
//                 name: groupName,
//                 desc: groupDesc,
//                 code: newCode,
//             });
//         }

//         setMode("createComplete");
//     }

//     const handleEnterGroup = () => {
//         if (onEnterGroup) {
//             onEnterGroup(groupCode);
//         }
//         onClose();
//         resetAll();
//     };


//   return (
//     <Modal
//     inVisible={visible}
//     onBackdropPress={() => {
//         onClose();
//         resetAll();
//     }}
//     onBackButtonPress={() => {
//         onClose();
//         resetAll();
//     }}
//     style={styles.modal}
//     swipeDirection="down"
//     animationIn="slideInUp"
//     animationOut="slideOutDown"
//     backdropOpacity={0.3}
//     >
//         <View style={styles.container}>
//             <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => {
//                 onClose();
//                 resetAll();
//             }}
//             >
//                 <Image source={require("../../assets/img/disabledIcon.png")} />
//             </TouchableOpacity>

//             {mode === "select" && (
//                 <>

//                     <SemiBoldText style={styles.title}>그룹 추가하기</SemiBoldText>
//                     <View style={styles.subTextSection}>
//                         <Image source={require("../../assets/img/group-add-icon.png")}
//                         style={styles.subTextIcon} />
//                         <SemiBoldText style={styles.subText}>소속된 그룹을 추가해 보세요!</SemiBoldText>
//                     </View>

//                     <View style={styles.buttonGroup}>
//                         <TouchableOpacity
//                         style={styles.mainButton}
//                         onPress={()=> setMode("create")}
//                         >
//                             <SemiBoldText style={styles.mainButtonText}>그룹 생성/초대</SemiBoldText>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                         style={styles.subButton}
//                         onPress={() => setMode("enterCode")}
//                         >
//                             <SemiBoldText style={styles.subButtonText}>그룹코드 입력</SemiBoldText>
//                         </TouchableOpacity>
//                     </View>
                    
//                 </>
//             )}

//             {mode === "create" && (
//                 <>
//                     <SemiBoldText style={styles.title}>그룹 생성하기</SemiBoldText>
//                     <TouchableOpacity
//                     style={styles.mainButton}
//                     onPress={handleCreateConfirm}
//                     >
//                         <SemiBoldText style={styles.confirmText}>확인</SemiBoldText>
//                     </TouchableOpacity>
//                     <Image source={require("../../assets/img/group1.png")}
//                     style={styles.profileImg} />
//                     <TextInput
//                     placeholder='그룹 이름일 입력하세요'
//                     style={styles.input}
//                     value={groupName}
//                     onChangeText={setGroupName} />
//                     <TextInput
//                     placeholder='그룹에 대한 설명을 입력하세요'
//                     style={[styles.input, {height: 70}]}
//                     multiline
//                     value={groupDesc}
//                     onChangeText={setGroupDesc} />
//                 </>
//             )}

//             {mode === "createComplete" && (
//                 <>
//                     <SemiBoldText style={styles.title}>그룹 생성 완료</SemiBoldText>
//                     <TouchableOpacity
//                     style={styles.mainButton}
//                     onPress={() => {
//                         onClose();
//                         resetAll();
//                     }}
//                     >
//                         <SemiBoldText style={styles.mainButtonText}>완료하기</SemiBoldText>
//                     </TouchableOpacity>
//                     <Image source={require("../../assets/img/group1.png")}
//                     style={styles.profileImg} />
//                     <View style={styles.codeBox}>
//                         <SemiBoldText style={styles.codeText}>{groupCode}</SemiBoldText>
//                     </View>
//                     <View style={styles.addGroupSubTextCard}>
//                         <Image source={require("../../assets/img/group-add-icon.png")}
//                         style={styles.subTextIcon} />
//                         <SemiBoldText style={styles.descText}>그룹 코드를 공유해 인원을 초대해 보세요!</SemiBoldText>
//                     </View>   
//                 </>
//             )}

//             {mode === "enterCode" && (
//                 <>
//                     <SemiBoldText style={styles.title}>그룹 추가하기</SemiBoldText>
//                     <TextInput
//                     placeholder='그룹 코드를 입력하세요'
//                     style={styles.input}
//                     value={groupCode}
//                     onChangeText={setGroupCode}
//                     />
//                     <TouchableOpacity
//                     style={styles.mainButton}
//                     onPress={handleEnterGroup}
//                     >
//                         <TextInput style={styles.mainButtonText}>입장하기</TextInput>
//                     </TouchableOpacity>
//                 </>
//             )}
//         </View>
//     </Modal>
//   )
// }

// export default AddGroupModal

// const styles = StyleSheet.create({
//   modal: {
//     justifyContent: "flex-end",
//     margin: 0,
//   },
//   container: {
//     backgroundColor: "white",
//     paddingBottom: 30,
//     paddingTop: 20,
//     paddingHorizontal: 25,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   profileImg: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     alignSelf: "center",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   mainButton: {
//     backgroundColor: "#6B4EFF",
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   mainButtonText: {
//     textAlign: "center",
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   subButton: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#6B4EFF",
//     marginTop: 10,
//   },
//   subButtonText: {
//     textAlign: "center",
//     color: "#6B4EFF",
//     fontSize: 16,
//     fontWeight: "600",ㄴ
//   },
//   codeBox: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 15,
//     borderRadius: 10,
//     width: "80%",
//     alignSelf: "center",
//     marginVertical: 20,
//   },
//   codeText: {
//     textAlign: "center",
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   descText: {
//     textAlign: "center",
//     color: "#777",
//     marginBottom: 20,
//   },
// });