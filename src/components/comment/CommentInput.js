import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SemiBoldText from '../customText/SemiBoldText';

const CommentInput = ({
    isAnonymous,
    setIsAnonymous,
    inputText,
    setInputText,
    onSubmit,
    isReply,
}) => {
    return (
        <View style={styles.inputCard}>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    onPress={() => setIsAnonymous(!isAnonymous)}
                    style={styles.isAnonymousButton}
                >
                    <Image
                        source={
                            isAnonymous
                                ? require("../../assets/img/isAnonymousTrue.png")
                                : require("../../assets/img/isAnonymousFalse.png")
                        }
                        style={styles.isAnonymousIcon}
                    />

                    <SemiBoldText
                        style={[
                            styles.isAnonymousText,
                            { color: isAnonymous ? "#7242E2" : "#ADADAD" },
                        ]}
                    >
                        익명
                    </SemiBoldText>
                </TouchableOpacity>

                <TextInput
                    style={styles.inputBox}
                    placeholder={isReply ? "답글을 입력하세요" : "댓글을 입력하세요"}
                    value={inputText}
                    onChangeText={setInputText}
                />

                <TouchableOpacity onPress={onSubmit}>
                    <Image
                        source={require("../../assets/img/sendIcon.png")}
                        style={styles.sendIcon}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default CommentInput;

const styles = StyleSheet.create({
    inputCard: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ADADAD",
        borderRadius: 20,
        width: "90%",
        alignItems: "center",
        padding: 12,
        justifyContent: "space-between",
    },
    isAnonymousButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginLeft: 8,
    },
    isAnonymousIcon: {
        width: 22,
        height: 22,
    },
    isAnonymousText: {
        fontSize: 14.5,
    },
    inputBox: {
        width: "65%",
        fontSize: 14.6,
        color: "#ADADAD"
    },
    sendIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
    }
});
