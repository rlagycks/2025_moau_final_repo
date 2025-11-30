import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, StyleSheet, Image} from "react-native";
import RegularText from "../../../components/customText/RegularText";
import SemiBoldText from "../../../components/customText/SemiBoldText";
import { noticeMockData } from "../../../data/notice";
import PageNavHeader from "../../../components/nav/PageNavHeader";
import SearchBar from "../../../components/SearchBar";

const GroupNoticeList = ({ navigation, route }) => {
  const { groupId, isAdmin } = route.params;

  const notices = noticeMockData[groupId] || [];
  const [category, setCategory] = useState("일반")

  const handlePress = (noticeId) => {
    navigation.navigate("GroupNoticeDetail", {
      groupId,
      noticeId,
      isAdmin
    });
  };

  const filteredNotices = notices.filter((item) => {
    if (category === "전체") return true;
    if (category === "투표") return item.vote;
    if (category === "일반") return !item.vote;
  })

  const categoryButtons = ["전체", "투표", "일반"];

  const [keyword, setKeyword] = useState("");
  
      const filteredPosts = notices.filter(notice =>
          notice.title.includes(keyword) || notice.content.includes(keyword)
      );

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
                
                {filteredNotices.map((item) => (
                <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handlePress(item.id)}
                >
                    <View style={styles.authorSection}>
                        <SemiBoldText style={styles.authorName}>{item.authorName}</SemiBoldText>
                        <SemiBoldText style={styles.createdAt}>{item.createdAt}</SemiBoldText>
                    </View>
                        <SemiBoldText style={styles.title}>{item.title}</SemiBoldText>
                                            
                    <RegularText numberOfLines={2} style={styles.content}>{item.content}</RegularText>

                {item.images?.length > 0 && (
                    <Image
                    source={{ uri: item.images[0] }}
                    style={styles.thumbnail}
                    />
                )}

                {item.vote && (
                    <View style={styles.voteBadge}>
                        <RegularText style={styles.voteText}>투표 포함</RegularText>
                    </View>
                )}

                <View style={styles.footerRow}>
                    <Image source={require("../../../assets/img/commentCountIcon.png")}
                    style={styles.commentCountIcon} />
                    <RegularText style={styles.commentCountText}>{item.commentCount || 0}</RegularText>
                </View>
                </TouchableOpacity>
            ))}
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
