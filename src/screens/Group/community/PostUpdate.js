import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import BoldText from '../../../components/customText/BoldText';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import PageNavHeader from '../../../components/nav/PageNavHeader';
import { createPost } from '../../../services/communityService';
import { useCommunityStore } from '../../../store/useCommunityStore';

const CommunityPostUpdate = ({ navigation, route }) => {
  const { teamId } = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const fetchPosts = useCommunityStore(state => state.fetchPosts);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    const postData = {
      title,
      content,
      anonymous: isAnonymous,
    };

    try {
      await createPost(teamId, postData);

      Alert.alert('완료', '게시글이 등록되었습니다.');

      // 게시글 목록 새로고침
      await fetchPosts(teamId);

      navigation.goBack();
    } catch (err) {
      Alert.alert('오류', '게시글 등록에 실패했습니다.');
      console.error('게시글 등록 실패:', err);
    }
  };

  // const currentTime = new Date().toISOString();

  return (
    <View style={styles.container}>
      <ScrollView>
        <PageNavHeader pageName="게시판" navigation={navigation} />
        <View style={styles.postInputCard}>
          <View style={styles.postInputSection}>
            <View style={styles.selectButton}>
              <TouchableOpacity
                onPress={() => setIsAnonymous(!isAnonymous)}
                style={styles.isAnonymousButton}
              >
                <Image
                  source={
                    isAnonymous
                      ? require('../../../assets/img/isAnonymousTrue.png')
                      : require('../../../assets/img/isAnonymousFalse.png')
                  }
                  style={styles.isAnonymousIcon}
                />

                <SemiBoldText
                  style={[
                    styles.isAnonymousText,
                    { color: isAnonymous ? '#7242E2' : '#ADADAD' },
                  ]}
                >
                  익명
                </SemiBoldText>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.textInputStyle,
                { color: title ? '#7242E2' : '#ADADAD' },
              ]}
              placeholder="제목을 입력하세요"
              placeholderTextColor="#ADADAD"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.divider} />

            <View style={styles.contentSection}>
              <TextInput
                style={styles.contentInputStyle}
                placeholder="내용을 입력하세요"
                placeholderTextColor="#ADADAD"
                value={content}
                onChangeText={setContent}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
        <View style={styles.postButtonSection}>
          <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
            <SemiBoldText style={styles.postText}>등록하기</SemiBoldText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityPostUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  postInputCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  postInputSection: {
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  isAnonymousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  isAnonymousIcon: {
    width: 22,
    height: 22,
  },
  isAnonymousText: {
    fontSize: 14.5,
  },
  textInputStyle: {
    fontSize: 22,
    fontFamily: 'Freesentation-6SemiBold',
    marginTop: 20,
  },
  divider: {
    borderWidth: 0.8,
    width: '100%',
    borderColor: '#ADADAD',
    marginVertical: 17,
  },
  contentSection: {
    width: '100%',
    height: 400,
  },
  contentInputStyle: {
    fontSize: 17,
    fontFamily: 'Fressentation-4Regular',
    color: '#3E247C',
  },
  postButtonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  postButton: {
    width: '90%',
    height: 61,
    borderRadius: 16,
    backgroundColor: '#7242E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postText: {
    fontSize: 26,
    color: '#FFFFFF',
  },
});
