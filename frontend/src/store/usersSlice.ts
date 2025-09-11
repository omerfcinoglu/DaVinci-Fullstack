import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NewUser, UpdateUser, User } from "../domain/types";
import type { RootState, ThunkExtra } from "./store";
import { nextId } from "@/helper/funcs";
import { removePostsByUser } from "./postsSlice";

type UsersState = {
  items: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = { items: [], loading: false, error: null };

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { state: RootState; extra: ThunkExtra }
>("users/fetchAll", async (_, { getState, extra }) => {
  const already = getState().users.items;
  if (already.length) {
    return already;
  }
  return extra.users.list();
});

// "orkestratör" thunk
export const deleteUserCascade = createAsyncThunk<
  void,
  number,
  { state: RootState }
>("users/deleteCascade", async (userId, { dispatch }) => {
  dispatch(removePostsByUser(userId));
  dispatch(deleteUser(userId));
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, { payload }: PayloadAction<NewUser>) {
      const user: User = { id: nextId(state.items), ...payload };
      state.items.push(user);
    },
    updateUser(
      state,
      { payload }: PayloadAction<{ id: number; patch: UpdateUser }>
    ) {
      state.items = state.items.map((u) =>
        u.id === payload.id ? { ...u, ...payload.patch } : u
      );
    },
    deleteUser(state, { payload }: PayloadAction<number>) {
      state.items = state.items.filter((u) => u.id !== payload);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
export const { addUser, updateUser, deleteUser } = usersSlice.actions;

export const selectUsers = (s: RootState) => s.users.items;
export const selectUsersLoading = (s: RootState) => s.users.loading;
export const selectUsersError = (s: RootState) => s.users.error;
