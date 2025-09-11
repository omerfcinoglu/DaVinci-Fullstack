import { configureStore } from "@reduxjs/toolkit";
import { restDataSource } from "../data/rest";
import type { DataSource } from "../data/ports";
import usersReducer from "./usersSlice";
import postsReducer from "./postsSlise";

export const dataSource: DataSource = restDataSource;

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      thunk: { extraArgument: dataSource },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkExtra = DataSource;
