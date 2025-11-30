export const communityMockData = {
  // ----------------------------
  // 👑 그룹 1: 로망
  // ----------------------------
  1: [
    {
      id: 1,
      title: "동방 비밀번호 아시는 분 계신가요?",
      content: "혹시 오늘자 동방 비밀번호 업데이트된 거 아시는 분 계신가요? 급해서 여쭤봐요!",
      createdAt: "2025-11-18 10:21",
      isAnonymous: false,
      authorName: "하승현",
      authorId: 101,
      comments: [
        {
          id: 1,
          content: "학생회에서 공지 올라왔어요! 4729로 변경됐다고 합니다.",
          createdAt: "2025-11-18 10:25",
          isAnonymous: true,
          authorName: "노다미",
          authorId: 201,
          isPostAuthor: false,
          replies: [
            {
              id: 1,
              content: "오 감사합니다! 진짜 급했어요 ㅠㅠ",
              createdAt: "2025-11-18 10:27",
              isAnonymous: false,
              authorName: "하승현",
              authorId: 101,
              isPostAuthor: true,
            }
          ]
        },
        {
          id: 2,
          content: "맞아요 오늘 아침에 바뀌었어요.",
          createdAt: "2025-11-18 10:32",
          isAnonymous: true,
          authorName: "김준수",
          authorId: 202,
          isPostAuthor: false,
          replies: []
        }
      ]
    },

    {
      id: 2,
      title: "소웨 과방 와이파이 또 안돼요",
      content: "오늘도 연결이 계속 끊기네요… 혹시 다른 분들도 그러신가요?",
      createdAt: "2025-11-14 13:22",
      isAnonymous: true,
      authorName: "강주은",
      authorId: 203,
      comments: [
        {
          id: 1,
          content: "저도 안돼요 ㅠㅠ",
          createdAt: "2025-11-14 13:23",
          isAnonymous: true,
          authorName: "경규호",
          authorId: 204,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "학생회에서 곧 공유기 바꾼다고 했어요!",
          createdAt: "2025-11-14 13:25",
          isAnonymous: false,
          authorName: "박서현",
          authorId: 205,
          isPostAuthor: false,
          replies: [
            {
              id: 1,
              content: "오 그렇군요 감사합니다!",
              createdAt: "2025-11-14 13:28",
              isAnonymous: true,
              authorName: "강주은",
              authorId: 203,
              isPostAuthor: true
            }
          ]
        }
      ]
    },

    {
      id: 3,
      title: "나의 발닦개가 되어 주실 분",
      content: "선착 3827402명",
      createdAt: "2025-11-15 20:50",
      isAnonymous: false,
      authorName: "고하늘",
      authorId: 102,
      comments: [
        {
          id: 1,
          content: "제가 하겠습니다 헥헥",
          createdAt: "2025-11-15 20:55",
          isAnonymous: false,
          authorName: "박태인",
          authorId: 206,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "ㅁㅊ것들",
          createdAt: "2025-11-15 21:01",
          isAnonymous: true,
          authorName: "하승현",
          authorId: 101,
          isPostAuthor: false,
          replies: []
        }
      ]
    },

    {
      id: 4,
      title: "나의 발닦개가 되어 주실 분",
      content: "선착 3827402명",
      createdAt: "2025-11-15 20:50",
      isAnonymous: false,
      authorName: "이동윤",
      authorId: 207,
      comments: [
        {
          id: 1,
          content: "누가 함?",
          createdAt: "2025-11-15 20:55",
          isAnonymous: false,
          authorName: "박서현",
          authorId: 205,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "ㅉㅉ",
          createdAt: "2025-11-15 21:01",
          isAnonymous: true,
          authorName: "노다미",
          authorId: 201,
          isPostAuthor: false,
          replies: []
        }
      ]
    },

    {
      id: 5,
      title: "풋살 할 사람",
      content: "오늘 날도 좋은데 풋살 하실 분 계신가여",
      createdAt: "2025-11-15 20:50",
      isAnonymous: false,
      authorName: "박태인",
      authorId: 206,
      comments: [
        {
          id: 1,
          content: "쩌요 !!!1!!!",
          createdAt: "2025-11-15 20:55",
          isAnonymous: false,
          authorName: "장유한",
          authorId: 208,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "지금 영하 17도야...",
          createdAt: "2025-11-15 21:01",
          isAnonymous: true,
          authorName: "박서현",
          authorId: 205,
          isPostAuthor: false,
          replies: []
        }
      ]
    },
  ],

  // ----------------------------
  // 👑 그룹 2: 구름톤 유니브
  // ----------------------------
  2: [
    {
      id: 1,
      title: "리액트 네이티브 Pod install 도와주실 분 있나요?",
      content: "iOS 빌드에서 Pod 충돌 계속 뜹니다…",
      createdAt: "2025-11-17 22:10",
      isAnonymous: true,
      authorName: "고하늘",
      authorId: 102,
      comments: [
        {
          id: 1,
          content: "어떤 에러인가요?",
          createdAt: "2025-11-17 22:12",
          isAnonymous: false,
          authorName: "김효찬",
          authorId: 209,
          isPostAuthor: false,
          replies: [
            {
              id: 1,
              content: "DoubleConversion.modulemap not found 입니다 ㅠ",
              createdAt: "2025-11-17 22:15",
              isAnonymous: true,
              authorName: "고하늘",
              authorId: 102,
              isPostAuthor: true
            }
          ]
        },
        {
          id: 2,
          content: "캐시 삭제하고 다시 하면 해결될 가능성 높아요!",
          createdAt: "2025-11-17 22:20",
          isAnonymous: true,
          authorName: "정기찬",
          authorId: 210,
          isPostAuthor: false,
          replies: []
        }
      ]
    },

    {
      id: 2,
      title: "주말에 사이드 프로젝트 하실 분?",
      content: "리액트 + Node 사이드 프로젝트 팀원 모집합니다!",
      createdAt: "2025-11-12 16:20",
      isAnonymous: false,
      authorName: "국태양",
      authorId: 211,
      comments: []
    },
  ],

  // ----------------------------
  // 👑 그룹 3: 폴라리스
  // ----------------------------
  3: [
    {
      id: 1,
      title: "에어팟 케이스 분실하신 분?",
      content: "오늘 동방 테이블 밑에서 하얀색 에어팟 케이스 주웠습니다!",
      createdAt: "2025-11-16 14:01",
      isAnonymous: false,
      authorName: "임예준",
      authorId: 212,
      comments: [
        {
          id: 1,
          content: "혹시 케이스에 이름 적혀있나요?",
          createdAt: "2025-11-16 14:05",
          isAnonymous: true,
          authorName: "김효찬",
          authorId: 209,
          isPostAuthor: false,
          replies: [
            {
              id: 1,
              content: "이니셜 K.H 적혀 있어요!",
              createdAt: "2025-11-16 14:06",
              isAnonymous: false,
              authorName: "임예준",
              authorId: 212,
              isPostAuthor: true
            }
          ]
        }
      ]
    },

    {
      id: 2,
      title: "발닦개 구인합니다",
      content: "모집 인원 8명입니다",
      createdAt: "2025-11-15 20:50",
      isAnonymous: false,
      authorName: "정기찬",
      authorId: 210,
      comments: [
        {
          id: 1,
          content: "형 저 투잡 뛰어도 되나요...",
          createdAt: "2025-11-15 20:55",
          isAnonymous: false,
          authorName: "국태양",
          authorId: 211,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "형 저 먹버 하는 거예요?",
          createdAt: "2025-11-15 21:01",
          isAnonymous: true,
          authorName: "김종혁",
          authorId: 213,
          isPostAuthor: false,
          replies: []
        }
      ]
    },

    {
      id: 3,
      title: "나의 발닦개가 되어 주실 분",
      content: "선착 3827402명",
      createdAt: "2025-11-15 20:50",
      isAnonymous: false,
      authorName: "고하늘",
      authorId: 102,
      comments: [
        {
          id: 1,
          content: "제가 하겠습니다 헥헥",
          createdAt: "2025-11-15 20:55",
          isAnonymous: false,
          authorName: "국태양",
          authorId: 211,
          isPostAuthor: false,
          replies: []
        },
        {
          id: 2,
          content: "덕분에 이해됐어요..! 👍",
          createdAt: "2025-11-15 21:01",
          isAnonymous: true,
          authorName: "김종혁",
          authorId: 213,
          isPostAuthor: false,
          replies: []
        }
      ]
    },
  ],
};
