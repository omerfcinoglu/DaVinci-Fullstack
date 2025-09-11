import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NewPost, Post, UpdatePost } from "../domain/types";
import type { RootState, ThunkExtra } from "./store";
import { nextId } from "@/helper/funcs";

type PostsState = {
  items: Post[];
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = { items: [], loading: false, error: null };

export const fetchPosts = createAsyncThunk<Post[], void, { extra: ThunkExtra }>(
  "posts/fetchAll",
  async (_, { extra }) => {
    return extra.posts.list();
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(state, { payload }: PayloadAction<NewPost>) {
      const post: Post = { id: nextId(state.items), ...payload };
      state.items.push(post);
    },
    updatePost(
      state,
      { payload }: PayloadAction<{ id: number; patch: UpdatePost }>
    ) {
      state.items = state.items.map((p) =>
        p.id === payload.id ? { ...p, ...payload.patch } : p
      );
    },
    deletePost(state, { payload }: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== payload);
    },
    removePostsByUser(state, { payload }: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.userId !== payload);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchPosts.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchPosts.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchPosts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load posts";
      });
  },
});

export default postsSlice.reducer;
export const { addPost, updatePost, deletePost, removePostsByUser } =
  postsSlice.actions;

export const selectPosts = (s: RootState) => s.posts.items;
export const selectPostsLoading = (s: RootState) => s.posts.loading;
export const selectPostsError = (s: RootState) => s.posts.error;
