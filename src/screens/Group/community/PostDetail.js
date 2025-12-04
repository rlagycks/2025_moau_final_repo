import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';
import dayjs from 'dayjs';
import CommentInput from '../../../components/comment/CommentInput';
import PageNavHeader from '../../../components/nav/PageNavHeader';
import {
  getPostDetail,
  createComment,
  deletePost,
  updatePost,
} from '../../../services/communityService';

const buildCommentTree = flatComments => {
  if (!Array.isArray(flatComments)) return [];

  const map = {};
  const roots = [];

  flatComments.forEach(c => {
    map[c.commentId] = { ...c, replies: [] };
  });

  flatComments.forEach(c => {
    map[c.commentId] = { ...c, replies: [] };
  });

  flatComments.forEach(c => {
    if (c.parentId === null) {
      roots.push(map[c.commentId]);
    } else if (map[c.parentId]) {
      map[c.parentId].replies.push(map[c.commentId]);
    }
  });

  return roots;
};

const useAnonymousMapping = comments => {
  return useMemo(() => {
    if (!Array.isArray(comments)) return {};

    let counter = 1;
    const mapping = {};
    const flat = []; //댓글+답글 전체를 시간순으로 정렬된 리스트로 변환

    comments.forEach(c => {
      flat.push({ ...c, isReply: false });

      const replies = Array.isArray(c.replies) ? c.replies : [];
      replies.forEach(r => {
        flat.push({ ...r, isReply: true });
      });
    });

    //댓글 생성 시간순 정렬
    flat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    //익명 사용자 userId: 익명 번호 매핑
    flat.forEach(item => {
      if (item.isAnonymous) {
        const key = item.authorName || item.commentId;

        if (!mapping[key]) {
          mapping[key] = `익명${counter}`;
          counter++;
        }
      }
    });

    return mapping;
  }, [comments]);
};

const PostDetail = ({ route, navigation }) => {
  const { teamId, postId } = route.params;

  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const comments = postDetail?.comments || [];
  const anonymousNameMap = useAnonymousMapping(comments);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPostDetail(teamId, postId);
      setPostDetail(data);
    } catch (err) {
      console.error('게시글 상세 조회 실패:', err);
      Alert.alert('오류', '게시글을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [teamId, postId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#7242E2" />
      </View>
    );
  }

  if (!postDetail) {
    return (
      <SemiBoldText style={{ textAlign: 'center', marginTop: 50 }}>
        게시글을 불러오는 중입니다...
      </SemiBoldText>
    );
  }

  const startEditMode = () => {
    setEditTitle(postDetail.title);
    setEditContent(postDetail.content);
    setIsEditingPost(true);
  };

  const cancelEdit = () => {
    setIsEditingPost(false);
  };

  const submitEdit = async () => {
    try {
      await updatePost(teamId, postId, {
        title: editTitle,
        content: editContent,
      });

      await fetchDetail();
      setIsEditingPost(false);
    } catch (err) {
      console.error('게시글 수정 실패: ', err.response?.data);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
  };

  const handleSubmitComment = async () => {
    if (!inputText.trim()) return;

    const body = {
      content: inputText.trim(),
      parentId: replyTarget ? replyTarget : null,
    };

    try {
      await createComment(teamId, postId, body);
      await fetchDetail();
      setInputText('');
      setReplyTarget(null);
    } catch (err) {
      Alert.alert('오류', '댓글 작성에 실패했습니다');
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  //   const addComment = () => {
  //     if (!inputText.trim()) return;

  //     const newComment = {
  //       id: comments.length + 1,
  //       userId: `user-${Date.now()}`,
  //       content: inputText,
  //       createdAt: new Date().toISOString(),
  //       isAnonymous: isAnonymous,
  //       authorName: '',
  //       replies: [],
  //     };

  //     setComments([...comments, newComment]);
  //     setInputText('');
  //   };

  //   const addReply = commentId => {
  //     if (!inputText.trim()) return;

  //     const updated = comments.map(c => {
  //       if (c.id === commentId) {
  //         return {
  //           ...c,
  //           replies: [
  //             ...c.replies,
  //             {
  //               id: Date.now(),
  //               userId: `reply-${Date.now()}`,
  //               content: inputText,
  //               createdAt: new Date().toISOString(),
  //               isAnonymous: isAnonymous,
  //               authorName: '',
  //             },
  //           ],
  //         };
  //       }

  //       return c;
  //     });

  //     setComments(updated);
  //     setInputText('');
  //     setReplyTargetId(null);
  //   };

  //   const getTotalCommentCount = post => {
  //     return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
  //   };

  //   if (!post) {
  //     return (
  //       <SemiBoldText style={{ fontSize: 12, color: '#ADADAD' }}>
  //         게시글을 찾을 수 없습니다.
  //       </SemiBoldText>
  //     );
  //   }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView>
          <PageNavHeader
            pageName="게시판"
            navigation={navigation}
            teamId={teamId}
          />

          <View style={styles.postCard}>
            <View style={styles.authorCard}>
              <BoldText style={styles.author}>{postDetail.authorName}</BoldText>
              <SemiBoldText style={styles.dateText}>
                {dayjs(postDetail.createdAt).format('YYYY-MM-DD HH:mm')}
              </SemiBoldText>
              <View style={styles.buttonGroup}>
                {/* 본인 글일 경우 수정/삭제 버튼 표시!! */}
                {postDetail.isMyPost && !isEditingPost && (
                  <View style={styles.myPostCard}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={startEditMode}
                    >
                      <SemiBoldText style={styles.btnText}>수정</SemiBoldText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={async () => {
                        Alert.alert('삭제', '정말 삭제할까요?', [
                          { text: '취소', style: 'cancel' },
                          {
                            text: '삭제',
                            onPress: async () => {
                              await deletePost(teamId, postId);
                              navigation.goBack();
                            },
                          },
                        ]);
                      }}
                    >
                      <SemiBoldText style={styles.btnText}>삭제</SemiBoldText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            {isEditingPost ? (
              <>
                <TextInput
                  value={editTitle}
                  onChangeText={setEditTitle}
                  style={[styles.postTitle, { color: '#B5B2B2' }]}
                />
                <TextInput
                  value={editContent}
                  onChangeText={setEditContent}
                  style={[styles.postContent, { color: '#4A3A90' }]}
                  multiline
                />
                <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={submitEdit}
                  >
                    <SemiBoldText style={styles.btnText}>완료</SemiBoldText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={cancelEdit}
                  >
                    <SemiBoldText style={styles.btnText}>취소</SemiBoldText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <BoldText style={styles.postTitle}>{postDetail.title}</BoldText>
                <View style={styles.divider} />
                <SemiBoldText style={styles.postContent}>
                  {postDetail.content}
                </SemiBoldText>
              </>
            )}
          </View>

          <View style={styles.commentCount}>
            <Image
              source={require('../../../assets/img/commentCountIcon.png')}
              style={styles.commentIcon}
            />
            <SemiBoldText style={styles.commentCountText}>
              {sortedComments.length}
            </SemiBoldText>
          </View>

          <View style={styles.commentCard}>
            {sortedComments.map(c => {
              const cid = c.commentId ?? c.id;
              const parentId = c.parentId ?? c.parentCommentId ?? null;
              return (
                <View
                  key={cid}
                  style={[
                    styles.commentBox,
                    parentId ? styles.replyBoxIndent : null,
                  ]}
                >
                  <SemiBoldText style={styles.commentAuthor}>
                    {c.isAnonymous
                      ? anonymousNameMap[c.authorName] || '익명'
                      : c.authorName}
                  </SemiBoldText>

                  <SemiBoldText style={styles.commentContent}>
                    {c.content}
                  </SemiBoldText>

                  <SemiBoldText style={styles.commentDateText}>
                    {dayjs(c.createdAt).format('YYYY-MM-DD HH:mm')}
                  </SemiBoldText>
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => setReplyTarget(cid)}
                  >
                    <SemiBoldText style={styles.buttonText}>답글</SemiBoldText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <CommentInput
          inputText={inputText}
          setInputText={setInputText}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          isReply={replyTarget !== null}
          onSubmit={handleSubmitComment}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '90%',
    marginTop: 40,
    alignSelf: 'center',
  },
  authorCard: {
    flexDirection: 'row',
    gap: 8,
  },
  author: {
    color: '#3E247C',
    fontSize: 18,
  },
  dateText: {
    color: '#B5B2B2',
    fontSize: 12,
    top: 4,
  },
  postTitle: {
    color: '#7242E2',
    fontSize: 19,
    marginTop: 16,
    fontFamily: 'Freesentation-6SemiBold', //수정 시 인풋창 폰트 불일치 문제로 추가
  },
  divider: {
    borderWidth: 0.5,
    borderColor: '#B5B2B2',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 17,
  },
  postContent: {
    color: '#3E247C',
    fontSize: 14,
    fontFamily: 'Freesentation-6SemiBold',
  },
  commentCount: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginLeft: 30,
    gap: 5,
  },
  commentIcon: {
    width: 15,
    height: 15,
  },
  commentCountText: {
    color: '#B5B2B2',
    fontSize: 12.5,
  },

  // comment card
  commentCard: {
    marginLeft: 30,
  },
  commentAuthor: {
    fontSize: 15,
    color: '#3E247C',
  },
  commentBox: {
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    width: '90%',
  },
  commentContent: {
    fontSize: 14,
    color: '#808080',
    marginTop: 4,
  },
  commentDateText: {
    fontSize: 12,
    color: '#B5B2B2',
    marginTop: 4,
    marginBottom: 8,
  },
  replyButton: {
    // borderBottomWidth: 0.8,
    // borderBottomColor: "#ADADAD",
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: 38,
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 1.5,
  },
  buttonText: {
    color: '#ADADAD',
    fontSize: 13,
  },
  replyBox: {
    marginTop: 10,
    marginLeft: 25,
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: '88%',
  },
  replyDateText: {
    fontSize: 12,
    color: '#B5B2B2',
    marginTop: 4,
  },

  // 댓글 입력창 input card
  inputCard: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ADADAD',
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    padding: 12,
    // gap: 45,
    justifyContent: 'space-between',
  },
  isAnonymousButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '65%',
    fontSize: 14.6,
    fontWeight: '700',
    color: '#ADADAD',
  },
  sendIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  buttonGroup: {},
  myPostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 45,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  btnText: {
    color: '#ADADAD',
  },
});
