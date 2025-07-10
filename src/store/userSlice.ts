import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role?: string;
  createdAt?: string;
}

interface UserState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/users/getUsers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch users');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk<User, any>(
  'users/createUser',
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/users/newUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create user');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: string; form: any }>(
  'users/updateUser',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/users/updateUser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update user');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk<string, string>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/users/deleteUser/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete user');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectUsers = (state: any) => state.users.items;
export const selectUserLoading = (state: any) => state.users.loading;
export const selectUserError = (state: any) => state.users.error;

export default userSlice.reducer; 