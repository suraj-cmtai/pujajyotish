import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Purohit {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  yogyagtaPramanPatra?: string;
  idProof?: string;
  status?: string;
}

interface PurohitState {
  items: Purohit[];
  loading: boolean;
  error: string | null;
}

const initialState: PurohitState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPurohits = createAsyncThunk<Purohit[]>(
  'purohits/fetchPurohits',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/purohits/getAllPurohits`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch purohits');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch purohits');
    }
  }
);

export const createPurohit = createAsyncThunk<Purohit, any>(
  'purohits/createPurohit',
  async (form, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Append all fields, handling files
      Object.entries(form).forEach(([key, value]) => {
        if (
          (key === 'profileImage' || key === 'yogyagtaPramanPatra' || key === 'idProof') &&
          form[key + 'File'] instanceof File
        ) {
          formData.append(key, form[key + 'File']);
        } else if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          formData.append(key, String(value));
        }
        // else: skip appending if value is object (not a File)
      });
      const res = await fetch(`${API_URL}/v1/purohits/newPurohit`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create purohit');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create purohit');
    }
  }
);

export const updatePurohit = createAsyncThunk<Purohit, { id: string; form: any }>(
  'purohits/updatePurohit',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          (key === 'profileImage' || key === 'yogyagtaPramanPatra' || key === 'idProof') &&
          form[key + 'File'] instanceof File
        ) {
          formData.append(key, form[key + 'File']);
        } else if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          formData.append(key, String(value));
        }
        // else: skip appending if value is object (not a File)
      });
      const res = await fetch(`${API_URL}/v1/purohits/updatePurohit/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update purohit');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update purohit');
    }
  }
);

export const deletePurohit = createAsyncThunk<string, string>(
  'purohits/deletePurohit',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/purohits/deletePurohit/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete purohit');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete purohit');
    }
  }
);

const purohitSlice = createSlice({
  name: 'purohits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurohits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurohits.fulfilled, (state, action: PayloadAction<Purohit[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPurohits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPurohit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurohit.fulfilled, (state, action: PayloadAction<Purohit>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPurohit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePurohit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurohit.fulfilled, (state, action: PayloadAction<Purohit>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updatePurohit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePurohit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurohit.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deletePurohit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPurohits = (state: any) => state.purohits.items;
export const selectPurohitLoading = (state: any) => state.purohits.loading;
export const selectPurohitError = (state: any) => state.purohits.error;

export default purohitSlice.reducer; 