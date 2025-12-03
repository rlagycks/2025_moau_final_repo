import { create } from 'zustand';
import { getPostList } from '../services/communityService';

export const useCommunityStore = create((set, get) => ({
  posts: [],
  totalPages: 1,
  loading: false,

  fetchPosts: async (teamId, page = 0, size = 10) => {
    set({ loading: true });

    try {
      const data = await getPostList(teamId, page, size);

      set({
        posts: data.content,
        totalPages: data.totalPages,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.error('게시글 불러오기 실패:', err);
    }
  },
}));
