import { ScrollView, StyleSheet, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useMemo, useState } from 'react'
import { communityMockData } from '../../../data/community'
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';
import dayjs from 'dayjs';
import CommentInput from '../../../components/comment/CommentInput';
import PageNavHeader from '../../../components/nav/PageNavHeader';

const useAnonymousMapping = (comments) => {
        return useMemo(() => {
            let counter = 1;
            const mapping = {}; //userId -> 익명 번호

            const flat = []; //댓글+답글 전체를 시간순으로 정렬된 리스트로 변환

            comments.forEach((c) => {
                flat.push({...c, isReply: false});
                c.replies.forEach((r) => {
                    flat.push({...r, isReply: true});
                });
            });

            //댓글 생성 시간순 정렬
            flat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            //익명 사용자 userId: 익명 번호 매핑
            flat.forEach((item) => {
                if (item.isAnonymous) {
                   const key= item.authorName;

                   if (!mapping[key]) {
                        mapping[key] = `익명${counter}`;
                        counter++;
                   }
                }
            });

            return mapping;
        }, [comments]);
    };

const CommunityPostDetail = ({route, navigation}) => {
    const {groupId, postId} = route.params;
    const posts = communityMockData[groupId] || [];
    const post = posts.find(p => p.id === postId);

    const [comments, setComments] = useState(post.comments || []);
    const [inputText, setInputText] = useState("");
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(true);

    const anonymousNameMap = useAnonymousMapping(comments);

    const addComment = () => {
        if (!inputText.trim()) return;

        const newComment = {
            id: comments.length + 1,
            userId: `user-${Date.now()}`,
            content: inputText,
            createdAt: new Date().toISOString(),
            isAnonymous: isAnonymous,
            authorName: "",
            replies: [],
        };

        setComments([...comments, newComment]);
        setInputText("");
    };

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
                            userId: `reply-${Date.now()}`,
                            content: inputText,
                            createdAt: new Date().toISOString(),
                            isAnonymous: isAnonymous,
                            authorName: "",
                        },
                    ],
                };
            };

            return c;
        });
    
        setComments(updated);
        setInputText("");
        setReplyTargetId(null);
    };

    const getTotalCommentCount = (post) => {
        return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
    };

    if (!post) {
        return (
            <SemiBoldText style={{fontSize: 12, color: "#ADADAD"}}>
                게시글을 찾을 수 없습니다.
            </SemiBoldText>
        );
    }

    

  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
            <ScrollView>
                <PageNavHeader pageName="게시판" navigation={navigation} groupId={groupId}/>

                <View style={styles.postCard}>
                    <View style={styles.authorCard}>
                        <BoldText style={styles.author}>{post.authorName}</BoldText>
                        <SemiBoldText style={styles.dateText}>{post.createdAt}</SemiBoldText>
                    </View>
                    <BoldText style={styles.postTitle}>{post.title}</BoldText>
                    <View style={styles.divider} />
                    <SemiBoldText style={styles.postContent}>{post.content}</SemiBoldText>
                </View>
                <View style={styles.commentCount}>
                    <Image source={require("../../../assets/img/commentCountIcon.png")}
                    style={styles.commentIcon} />
                    <SemiBoldText style={styles.commentCountText}>{getTotalCommentCount(post)}</SemiBoldText>
                </View>

                <View style={styles.commentCard}>
                    {comments.map((comment) => {
                        const commentUser = comment.isAnonymous
                        ? anonymousNameMap[comment.authorName]
                        : comment.authorName;

                        const displayName = comment.isPostAuthor
                        ? `${commentUser} (작성자)`
                        : commentUser;

                        return (
                            <View key={comment.id} style={styles.commentBox}>
                                <SemiBoldText style={styles.commentAuthor}>{displayName}</SemiBoldText>
                                <SemiBoldText style={styles.commentContent}>{comment.content}</SemiBoldText>
                                <SemiBoldText style={styles.commentDateText}>
                                    {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                                </SemiBoldText>

                                <TouchableOpacity style={styles.replyButton}
                                onPress={() => setReplyTargetId(comment.id)}>
                                    <SemiBoldText style={styles.buttonText}>답글</SemiBoldText>
                                </TouchableOpacity>

                                {comment.replies.map((reply) => {
                                    const replyUser = reply.isAnonymous
                                    ? anonymousNameMap[reply.authorName]
                                    : reply.authorName;

                                    const displayReplyName = reply.isPostAuthor
                                    ? `${replyUser} (작성자)`
                                    : replyUser;

                                    return (
                                        <View key={reply.id} style={styles.replyBox}>
                                            <SemiBoldText style={styles.commentAuthor}>{displayReplyName}</SemiBoldText>
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

            </ScrollView>
            <CommentInput
            inputText={inputText}
            setInputText={setInputText}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            isReply={replyTargetId !== null}
            onSubmit={() => {
                replyTargetId ?  addReply(replyTargetId) : addComment()
            }}
            />
        </View>
    </KeyboardAvoidingView>
  )
}

export default CommunityPostDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 8,
    },
    postCard: {
        backgroundColor: "#FFFFFF",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 20,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowOffset: {width: 0, height: 4},
        elevation: 4,
        width: "90%",
        marginTop: 40,
        alignSelf: "center"
    },
    authorCard: {
        flexDirection: "row",
        gap: 8,
    },
    author: {
        color: "#3E247C",
        fontSize: 18,
    },
    dateText: {
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
        marginVertical: 17,
    },
    postContent: {
        color: "#3E247C",
        fontSize: 14,
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
        // borderBottomWidth: 0.8,
        // borderBottomColor: "#ADADAD",
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

    // 댓글 입력창 input card
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
        // gap: 45,
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
        // marginLeft: 5,
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
})