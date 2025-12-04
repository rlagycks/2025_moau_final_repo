import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import RegularText from "../../../components/customText/RegularText";
import SemiBoldText from "../../../components/customText/SemiBoldText";
import PageNavHeader from "../../../components/nav/PageNavHeader";
import SearchBar from "../../../components/SearchBar";
import * as noticeService from "../../../services/noticeService";

const GroupNoticeList = ({ navigation, route }) => {
  const teamId = route.params?.teamId ?? route.params?.groupId;
  const isAdmin = route.params?.isAdmin ?? false;

  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState("전체")
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!teamId) return;
    fetchNotices();
  }, [teamId]);

  const fetchNotices = async (page = 0) => {
    setLoading(true);
    try {
      const data = await noticeService.getNotices(teamId, page);
      const content = data?.content ?? data?.notices ?? data;
      setNotices(Array.isArray(content) ? content : []);
    } catch (err) {
      console.error("공지 목록 불러오기 실패:", err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (noticeId) => {
    if (!noticeId) return;
    navigation.navigate("GroupNoticeDetail", {
      groupId: teamId,
      teamId,
      noticeId,
      isAdmin
    });
  };

  const isVoteNotice = (notice) => {
    return Boolean(
      notice?.vote ||
      notice?.poll ||
      notice?.pollId ||
      (notice?.voteOptions && notice.voteOptions.length > 0) ||
      notice?.hasVote ||
      notice?.type === "VOTE"
    );
  };

  const filteredNotices = useMemo(() => {
    const byCategory = notices.filter((item) => {
      const hasVote = isVoteNotice(item);
      if (category === "전체") return true;
      if (category === "투표") return hasVote;
      if (category === "일반") return !hasVote;
      return true;
    });

    if (!keyword.trim()) return byCategory;

    return byCategory.filter((notice) => {
      const title = notice.title || "";
      const content = notice.content || "";
      const lowerKeyword = keyword.toLowerCase();
      return (
        title.toLowerCase().includes(lowerKeyword) ||
        content.toLowerCase().includes(lowerKeyword)
      );
    });
  }, [notices, category, keyword]);

  const categoryButtons = ["전체", "투표", "일반"];

  return (
    <View style={styles.container}>
        <PageNavHeader pageName="공지" navigation={navigation} />

        <View style={styles.categoryWrap}>
            {categoryButtons.map((cat) => {
                const isActive = category === cat;
                return (
                    <TouchableOpacity
                    key={cat}
                    style={[
                        styles.categoryBtn,
                        {backgroundColor: isActive ? "#EEE7FF" : "#F1F1F1"},
                    ]}
                    onPress={() => setCategory(cat)}
                    >
                        <SemiBoldText style={[
                            styles.btnText,
                            {color: isActive ? "#3E247C" : "#ADADAD"}
                        ]}>{cat}</SemiBoldText>
                    </TouchableOpacity>
                )
            })}
        </View>

        <ScrollView>
            <SearchBar
                value={keyword}
                onChangeText={setKeyword}
                placeholder="검색어를 입력하세요"
                showClear={true}
                onClear={() => setKeyword("")}
                style={styles.searchBar}
            />
            <View style={styles.noticeSection}>
                
                {loading && (
                  <ActivityIndicator size="large" color="#7242E2" style={{ marginTop: 20 }} />
                )}

                {!loading && filteredNotices.length === 0 && (
                  <RegularText style={{ color: "#808080" }}>등록된 공지가 없습니다.</RegularText>
                )}

                {!loading && filteredNotices.map((item, index) => {
                  const noticeId = item.id ?? item.noticeId;
                  const authorName = item.authorName || item.writerName || item.createdByName || "알 수 없음";
                  const createdAt = item.createdAt || item.createdDate || "";
                  const images = item.images || item.imageUrls || item.attachments || [];
                  const hasVote = isVoteNotice(item);
                  const commentCount = item.commentCount ?? item.commentsCount ?? item.comments?.length ?? 0;
                  const title = item.title || item.name || "";
                  const content = item.content || item.body || "";

                  return (
                    <TouchableOpacity
                    key={noticeId ?? index}
                    style={styles.card}
                    onPress={() => handlePress(noticeId)}
                    >
                        <View style={styles.authorSection}>
                            <SemiBoldText style={styles.authorName}>{authorName}</SemiBoldText>
                            <SemiBoldText style={styles.createdAt}>{createdAt}</SemiBoldText>
                        </View>
                            <SemiBoldText style={styles.title}>{title}</SemiBoldText>
                                                
                        <RegularText numberOfLines={2} style={styles.content}>{content}</RegularText>

                    {images?.length > 0 && (
                        <Image
                        source={{ uri: images[0] }}
                        style={styles.thumbnail}
                        />
                    )}

                    {hasVote && (
                        <View style={styles.voteBadge}>
                            <RegularText style={styles.voteText}>투표 포함</RegularText>
                        </View>
                    )}

                    <View style={styles.footerRow}>
                        <Image source={require("../../../assets/img/commentCountIcon.png")}
                        style={styles.commentCountIcon} />
                        <RegularText style={styles.commentCountText}>{commentCount}</RegularText>
                    </View>
                    </TouchableOpacity>
                )})}
            </View>
            
            </ScrollView>
    </View>
    
  );
};

export default GroupNoticeList;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 8,
},
categoryWrap: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginVertical: 20,
    marginLeft: 25
},
categoryBtn: {
    width: 59,
    height: 24,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
},
searchBar: {
    alignSelf: "center",
    marginTop: 8,
},
  noticeSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginBottom: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowOffset: {width: 0, height: 4},
        elevation: 4,
        width: 343,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorName: {
    fontSize: 17,
    color: "#3E247C"
  },
  createdAt: {
    color: "#B5B2B2",
    fontSize: 13,
  },
  title: {
    color: "#808080",
    fontSize: 16,
    marginTop: 10,
  },
  content: {
    color: "#B5B2B2",
    fontSize: 14,
    marginTop: 6
  },
  thumbnail: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1.2,
    borderColor: "#ADADAD",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 5,
  },
  commentCountIcon: {
    width: 15,
    height: 15,
  },
  commentCountText: {
    color: "#B5B2B2",
    fontSize: 12.5,
  },
  voteBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#E8E0FF",
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  voteText: { 
    color: "#5A2DE1", 
    fontSize: 12 
}
});
