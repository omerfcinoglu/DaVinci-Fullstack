import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import postsReducer from "./postsSlice";
import { restDataSource } from "@/data/rest";
import type { DataSource } from "@/data/ports";
import {
  loadUsersFromLS,
  loadPostsFromLS,
  saveUsersToLS,
  savePostsToLS,
} from "@/persist/storage";

export const dataSource: DataSource = restDataSource;

const preloadedState = {
  users: {
    items: loadUsersFromLS(),
    loading: false,
    error: null as string | null,
  },
  posts: {
    items: loadPostsFromLS(),
    loading: false,
    error: null as string | null,
  },
};

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
  preloadedState,
  middleware: (getDefault) =>
    getDefault({
      thunk: { extraArgument: dataSource },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkExtra = DataSource;

let lastUsers = store.getState().users.items;
let lastPosts = store.getState().posts.items;

store.subscribe(() => {
  const s = store.getState();
  if (s.users.items !== lastUsers) {
    lastUsers = s.users.items;
    saveUsersToLS(lastUsers);
  }
  if (s.posts.items !== lastPosts) {
    lastPosts = s.posts.items;
    savePostsToLS(lastPosts);
  }
});
