import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../domain/types";
import type { RootState, ThunkExtra } from "./store";

type UsersState = {
  items: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = { items: [], loading: false, error: null };

export const fetchUsers = createAsyncThunk<User[], void, { extra: ThunkExtra }>(
  "users/fetchAll",
  async (_, { extra }) => {
    return extra.users.list();
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // CRUD actions can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchUsers.rejected, (s, action) => {
        s.loading = false;
        s.error = action.error.message ?? "Failed to load users";
      });
  },
});

export default usersSlice.reducer;

// selectors
export const selectUsers = (state: RootState): User[] =>
  (state.users as UsersState).items;
export const selectUsersLoading = (state: RootState): boolean =>
  (state.users as UsersState).loading;
export const selectUsersError = (state: RootState): string | null =>
  (state.users as UsersState).error;
