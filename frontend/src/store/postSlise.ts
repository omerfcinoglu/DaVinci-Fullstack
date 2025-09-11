import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Post } from "../domain/types";
import type { RootState, ThunkExtra } from "./store";

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
    // CRUD actions can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPosts.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchPosts.rejected, (s, action) => {
        s.loading = false;
        s.error = action.error.message ?? "Failed to load posts";
      });
  },
});

export default postsSlice.reducer;

export const selectPosts = (state: RootState) =>
  (state.posts as PostsState).items;
export const selectPostsLoading = (state: RootState) =>
  (state.posts as PostsState).loading;
export const selectPostsError = (state: RootState) =>
  (state.posts as PostsState).error;
