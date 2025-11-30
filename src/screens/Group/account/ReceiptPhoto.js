import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { launchCamera } from "react-native-image-picker";
import SemiBoldText from "../../../components/customText/SemiBoldText";

const ReceiptPhoto = ({ navigation }) => {

  const handleCapture = async () => {
    try {
      // 지연 방지 (카메라 전환 시 JS thread 멈춤 완화)
      await new Promise(res => setTimeout(res, 150));

      const result = await launchCamera({
        mediaType: "photo",
        cameraType: "back",
        saveToPhotos: false,
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.errorCode || result.errorMessage) {
        console.log("Camera Error:", result.errorCode, result.errorMessage);
        return;
      }

      const photo = result.assets?.[0];
      if (!photo) return;

      navigation.navigate("RequestAccept", {
        imageUri: photo.uri,
      });

    } catch (err) {
      console.log("Camera Launch Exception:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCapture} style={styles.button}>
        <SemiBoldText style={styles.buttonText}>촬영하기</SemiBoldText>
      </TouchableOpacity>
    </View>
  );
};

export default ReceiptPhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: 'center',
    alignItems: "center",
  },
  button: {
    backgroundColor: "#B49BF0",
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: "center",
    width: 316,
    height: 61,
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
