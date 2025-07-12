import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Home {
  id: string;
  name: string;
  title: string;
  description: string;
}

interface HomeState {
  items: Home[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchHomes = createAsyncThunk<Home[]>(
  'home/fetchHomes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/home/getHome`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch homes');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch homes');
    }
  }
);

export const updateHome = createAsyncThunk<Home, { id: string; form: any }>(
  'home/updateHome',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/home/updateHome/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update home');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update home');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomes.fulfilled, (state, action: PayloadAction<Home[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHome.fulfilled, (state, action: PayloadAction<Home>) => {
        state.loading = false;
        const idx = state.items.findIndex(h => h.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectHomes = (state: any) => state.home.items;
export const selectHomeLoading = (state: any) => state.home.loading;
export const selectHomeError = (state: any) => state.home.error;

export default homeSlice.reducer; 