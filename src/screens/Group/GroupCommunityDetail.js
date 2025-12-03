import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import BoldText from '../../components/customText/BoldText';
import SemiBoldText from '../../components/customText/SemiBoldText';
import SearchBar from '../../components/SearchBar';
import RegularText from '../../components/customText/RegularText';
import PageNavHeader from '../../components/nav/PageNavHeader';

import { useCommunityStore } from '../../store/useCommunityStore';

const GroupCommunityDetail = ({ route, navigation }) => {
  const { teamId } = route.params;
  const { posts, loading, fetchPosts } = useCommunityStore();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchPosts(teamId);
  }, [teamId]);

  const filteredPosts = posts.filter(
    post =>
      post.title.includes(keyword) || post.contentPreview.includes(keyword),
  );

  const getTotalCommentCount = post => {
    const commentCount = post.comments.length;
    const replyCount = post.comments.reduce(
      (acc, c) => acc + c.replies.length,
      0,
    );
    return commentCount + replyCount;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <PageNavHeader
          pageName="게시판"
          navigation={navigation}
          teamId={teamId}
        />

        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="검색어를 입력하세요"
          showClear={true}
          onClear={() => setKeyword('')}
          style={styles.searchBar}
        />

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            size="large"
            color="#3E247C"
          />
        ) : (
          <View style={styles.postSection}>
            {!loading && filteredPosts.length === 0 ? (
              <SemiBoldText style={styles.noPostText}>
                등록된 게시글이 없어요. 첫 게시글을 등록해 보세요!
              </SemiBoldText>
            ) : (
              filteredPosts.map(post => (
                <TouchableOpacity
                  key={post.postId}
                  style={styles.postContainer}
                  onPress={() =>
                    navigation.navigate('CommunityPostDetail', {
                      postId: post.postId,
                      teamId: teamId,
                    })
                  }
                >
                  <View style={styles.authorCard}>
                    <BoldText style={styles.author}>{post.authorName}</BoldText>
                    <SemiBoldText style={styles.dateText}>
                      {post.createdAt.slice(0, 10)}
                    </SemiBoldText>
                  </View>
                  <SemiBoldText style={styles.postTitle}>
                    {post.title}
                  </SemiBoldText>
                  <RegularText style={styles.postContent} numberOfLines={1}>
                    {post.contentPreview}
                  </RegularText>

                  <View style={styles.commentCount}>
                    <Image
                      source={require('../../assets/img/commentCountIcon.png')}
                      style={styles.commentIcon}
                    />
                    <SemiBoldText style={styles.commentCountText}>
                      {post.commentCount}
                    </SemiBoldText>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.postIconSection}
        onPress={() => navigation.navigate('CommunityPost', { teamId })}
      >
        <Image
          source={require('../../assets/img/postUpdateIcon.png')}
          style={styles.postIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GroupCommunityDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  searchBar: {
    alignSelf: 'center',
    marginTop: 30,
  },
  postSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: 343,
  },
  authorCard: {
    flexDirection: 'row',
    gap: 8,
  },
  author: {
    color: '#3E247C',
    fontSize: 17,
  },
  dateText: {
    color: '#B5B2B2',
    fontSize: 11,
    top: 3.9,
  },
  postTitle: {
    color: '#808080',
    fontSize: 16,
    marginTop: 10,
  },
  postContent: {
    color: '#B5B2B2',
    fontSize: 14,
    marginTop: 6,
  },
  commentCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 8,
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
  postIconSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 40,
    right: 170,
    backgroundColor: '#FFFFFF',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderRadius: 50,
  },
  postIcon: {
    width: 33,
    height: 33,
  },
  noPostText: {
    fontSize: 15,
    color: '#B5B2B2',
    marginVertical: 12,
  },
});
