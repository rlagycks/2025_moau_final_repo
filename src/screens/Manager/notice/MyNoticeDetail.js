import { ScrollView, StyleSheet, TouchableOpacity, View, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, {useMemo, useState} from 'react'
import SemiBoldText from '../../../components/customText/SemiBoldText';
import RegularText from '../../../components/customText/RegularText';
import dayjs from 'dayjs';
import CommentInput from '../../../components/comment/CommentInput';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';
const useAnonymousMapping = (comments) => {
    
    return useMemo(() => {
        let counter = 1;
        const mapping = {};

        const flat = [];
        comments.forEach((c) => {
            flat.push({...c, isReply: false});
            c.replies.forEach((r) => {
                flat.push({...r, isReply: true});
            });
        });

        flat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        flat.forEach((item) => {
            if (item.isAnonymous) {
                const key = item.authorName;
                if (!mapping[key]) {
                    mapping[key] = `익명${counter}`;
                    counter++;
                }
            }
        });
        
        return mapping;
    }, [comments]);
    
};



const MyNoticeDetail = ({route, navigation}) => {
    const {title, content, authorName, createdAt, image = [], groupId, vote} = route.params;
    const formatted = dayjs(createdAt).format("YYYY-MM-DD HH:mm");
    const [comments, setComments] = useState([]);
    const [inputText, setInputText] = useState("");
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isAnonymousComment, setIsAnonymousComment] = useState(true);

    const anonymousNameMap = useAnonymousMapping(comments);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [voteSubmitted, setVoteSubmitted] = useState(false);

    const handleSelectOption = (index) => {
        if (!vote) return;
        const isMulti = vote.type === "multi";
        if (isMulti) {
            if (selectedOptions.includes(index)) {
                setSelectedOptions(selectedOptions.filter(i => i !== index));
            } else {
                setSelectedOptions([...selectedOptions, index]);
            } 
        } else {
                setSelectedOptions([index]);
            }

            if (voteSubmitted) setVoteSubmitted(false);
    };

    const handleVote = () => {
        if (selectedOptions.length === 0) return;
        setVoteSubmitted(true);
    };

    const addComment = () => {
        if (!inputText.trim()) return;

        const newComment = {
            id: Date.now(),
            content: inputText,
            createdAt: new Date().toISOString(),
            isAnonymous: isAnonymousComment,
            authorName: "currentUser",
            replies: [],
        };

        setComments([...comments, newComment]);
        setInputText("");
    }

    const addReply = (commentId) => {
        if (!inputText.trim()) return;

        const updated = comments.map((c) => {
            if (c.id === commentId) {
                return {
                    ...c,
                    replies: [
                        ...c.replies,
                        {
                            id: Date.now(),
                            content: inputText,
                            createdAt: new Date().toISOString(),
                            isAnonymous: isAnonymousComment,
                            authorName: "currentUser",
                        },
                    ],
                };
            }
            return c;
        });

        setComments(updated);
        setInputText("");
        setReplyTargetId(null);
    }

    const getTotalCommentCount = () => {
        return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
    }


  return (
    <KeyboardAvoidingView style={{flex: 1}}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
            <ScrollView>
                <ManagePageNavHeader pageName="공지" groupId={groupId} navigation={navigation} />

                <View style={styles.postDetailCard}>
                    <View style={styles.authorSection}>
                        <SemiBoldText style={styles.authorName}>{authorName}</SemiBoldText>
                        <SemiBoldText style={styles.createdAt}>{formatted}</SemiBoldText>
                    </View>
                
                    <SemiBoldText style={styles.postTitle}>{title}</SemiBoldText>

                    <View style={styles.divider} />

                    {image.length > 0 && (
                        <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScroll}
                        contentContainerStyle={styles.imageRow}>
                            {image.map((uri, idx) => (
                                <Image key={idx}
                                source={{uri}}
                                style={styles.postImage}
                                resizeMode='cover'
                                />
                            ))}
                        </ScrollView>
                    )}

                    <RegularText style={styles.postContent}>{content}</RegularText>
                    
                    {vote && (
                    <View style={styles.voteContainer}>
                        {vote.options.map((opt, idx) => {
                            const isSelected = selectedOptions.includes(idx);
                            return (
                                <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.voteOption,
                                    {backgroundColor: isSelected ? "#EEE7FF" : "#F4F4F4"}
                                ]}
                                onPress={() => handleSelectOption(idx)}
                                >
                                    <Image source={
                                        isSelected
                                        ? require("../../../assets/img/noticeCheckPurpleIcon.png")
                                        : require("../../../assets/img/noticeVoteCheckIcon.png")
                                    }
                                    style={styles.voteCheckBox}
                                    />
                                    <SemiBoldText style={{color: isSelected ? "#7242E2" : "#808080", fontSize: 16}}>
                                        {opt}
                                    </SemiBoldText>
                                </TouchableOpacity>
                            )
                        })}

                        <TouchableOpacity
                                style={[
                                    styles.voteButton,
                                    {
                                        backgroundColor: voteSubmitted ? "#B5B2B2" : "#7242E2"
                                    }
                                ]}
                                onPress={handleVote}
                            >
                                <SemiBoldText style={{color: "#FFFFFF", fontSize: 19}}>
                                    투표하기
                                </SemiBoldText>
                            </TouchableOpacity>
                    </View>
                )}

                </View>

                
                <View style={styles.commentCount}>
                    <Image source={require("../../../assets/img/commentCountIcon.png")}
                    style={styles.commentIcon} />
                    <SemiBoldText style={styles.commentCountText}>
                        {getTotalCommentCount()}
                    </SemiBoldText>
                </View>

                <View style={styles.commentCard}>
                    {comments.map((comment) => {
                        const commentUser = comment.isAnonymous
                        ? anonymousNameMap[comment.authorName]
                        : comment.authorName;

                        return (
                            <View key={comment.id} style={styles.commentBox}>
                                <SemiBoldText style={styles.commentAuthor}>{commentUser}</SemiBoldText>
                                <SemiBoldText style={styles.commentContent}>{comment.content}</SemiBoldText>
                                <SemiBoldText style={styles.commentDateText}>
                                    {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                </SemiBoldText>

                                <TouchableOpacity
                                style={styles.replyButton}
                                onPress={() => setReplyTargetId(comment.id)}
                                >
                                    <SemiBoldText style={styles.buttonText}>답글</SemiBoldText>
                                </TouchableOpacity>

                                {comment.replies.map((reply) => {
                                    const replyUser = reply.isAnonymous
                                    ? anonymousNameMap[reply.authorName]
                                    : reply.authorName;

                                    return (
                                        <View key={reply.id} style={styles.replyBox}>
                                            <SemiBoldText style={styles.commentAuthor}>{replyUser}</SemiBoldText>
                                            <SemiBoldText style={styles.commentContent}>{reply.content}</SemiBoldText>
                                            <SemiBoldText style={styles.replyDateText}>
                                                {dayjs(reply.createdAt).format("YYYY-MM-DD HH:mm")}
                                            </SemiBoldText>
                                        </View>
                                    );
                                })}
                            </View>
                        )
                    })}
                </View>

                <CommentInput
                isAnonymous={isAnonymousComment}
                setIsAnonymous={setIsAnonymousComment}
                inputText={inputText}
                setInputText={setInputText}
                isReply={!!replyTargetId}
                onSubmit={() =>
                    replyTargetId ? addReply(replyTargetId) : addComment()
                }
                />
            </ScrollView>
            
        </View>
    </KeyboardAvoidingView>
    
  )
}

export default MyNoticeDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        padding: 8,
    },
    
    postDetailCard: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowOffset: {width: 0, height: 4},
        elevation: 4,
        width: "90%",
        borderRadius: 20,
        padding: 25,
        alignSelf: "center",
        marginTop: 25,
    },
    authorSection: {
        flexDirection: "row",
        gap: 8,
    },
    authorName: {
        fontSize: 18,
        color: "#3E247C"
    },
    createdAt: {
        color: "#B5B2B2",
        fontSize: 12,
        top: 4,
    },
    postTitle: {
        color: "#7242E2",
        fontSize: 19,
        marginTop: 16,
    },
    divider: {
        borderWidth: 0.5,
        borderColor: "#B5B2B2",
        width: "100%",
        alignSelf: "center",
        marginTop: 9,
        marginVertical: 17,
    },
    postContent: {
        color: "#3E247C",
        fontSize: 14,
        marginTop: 10,
    },
    imageScroll: {
        width: "100%",
        marginVertical: 10,
    },
    imageRow: {
        flexDirection: "row",
        gap: 10,
    },
    postImage: {
        width: 200,
        height: 200,
        borderRadius: 16,
    },
    commentCount: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 25,
        marginLeft: 30,
        gap: 5,
    },
    commentIcon: {
        width: 15,
        height: 15,
    },
    commentCountText: {
        color: "#B5B2B2",
        fontSize: 12.5,
    },

    // comment card
    commentCard: {
        marginLeft: 30,
    },
    commentAuthor: {
        fontSize: 15,
        color: "#3E247C",
    },
    commentBox: {
        marginTop: 18,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        width: "90%",
    },
    commentContent: {
        fontSize: 14,
        color: "#808080",
        marginTop: 4,
    },
    commentDateText: {
        fontSize: 12,
        color: "#B5B2B2",
        marginTop: 4,
        marginBottom: 8,
    },
    replyButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#ADADAD",
        width: 38,
        height: 20,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 1.5,
    },
    buttonText: {
        color: "#ADADAD",
        fontSize: 13,
    },
    replyBox: {
        marginTop: 10,
        marginLeft: 25,
        backgroundColor: "#F4F4F4",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        width: "88%",
    },
    replyDateText: {
        fontSize: 12,
        color: "#B5B2B2",
        marginTop: 4,
    },

    // vote container
    voteContainer: {
        marginTop: 25,
        width: "100%",
        borderRadius: 20,
        padding: 15,
        marginBottom: 20,
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: "#ADADAD"
    },
    voteOption: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15,
        gap: 20,
        paddingLeft: 10,
        marginTop: 10,
        height: 50,
    },
    voteCheckBox: {
        width: 20,
        height: 20,
    },
    voteButton: {
        borderRadius: 15,
        alignItems: "center",
        marginTop: 14,
        paddingVertical: 16,
        paddingHorizontal: 25,
    }

})