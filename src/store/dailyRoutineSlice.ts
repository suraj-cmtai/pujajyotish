import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Rashi {
  name: string;
  prediction: string;
  image?: string;
}

export interface Panchang {
  nakshatra?: string;
  moonset?: string;
  karana?: string;
  tithi?: string;
  moonrise?: string;
  sunset?: string;
  sunrise?: string;
  vaara?: string;
  image?: string;
  yoga?: string;
  // location?: { latitude: string; longitude: string; city: string };
}

export interface DailyRoutine {
  id: string;
  date: string;
  title: string;
  description: string;
  rashis?: Rashi[];
  panchang?: Panchang;
}

interface DailyRoutineState {
  items: DailyRoutine[];
  loading: boolean;
  error: string | null;
}

const initialState: DailyRoutineState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchDailyRoutines = createAsyncThunk<DailyRoutine[]>(
  'dailyRoutines/fetchDailyRoutines',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/dailyroutines/getDailyRoutines`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch daily routines');
      // Map dailyData fields to top-level
      return (data.data || []).map((item: any) => {
        if (item.dailyData) {
          return {
            ...item.dailyData,
            id: item.id,
          };
        }
        return item;
      });
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch daily routines');
    }
  }
);

export const createDailyRoutine = createAsyncThunk<DailyRoutine, any>(
  'dailyRoutines/createDailyRoutine',
  async (form, { rejectWithValue }) => {
    try {
      // Always wrap in dailyData
      const body = { dailyData: form };
      const res = await fetch(`${API_URL}/v1/dailyroutines/newDailyRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create daily routine');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create daily routine');
    }
  }
);

export const updateDailyRoutine = createAsyncThunk<DailyRoutine, { id: string; form: any }>(
  'dailyRoutines/updateDailyRoutine',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      // Always wrap in dailyData
      const body = { dailyData: form.dailyData ? form.dailyData : form };
      const res = await fetch(`${API_URL}/v1/dailyroutines/updateDailyRoutine/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update daily routine');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update daily routine');
    }
  }
);

export const deleteDailyRoutine = createAsyncThunk<string, string>(
  'dailyRoutines/deleteDailyRoutine',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/dailyroutines/deleteDailyRoutine/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete daily routine');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete daily routine');
    }
  }
);

const dailyRoutineSlice = createSlice({
  name: 'dailyRoutines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyRoutines.fulfilled, (state, action: PayloadAction<DailyRoutine[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDailyRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDailyRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDailyRoutine.fulfilled, (state, action: PayloadAction<DailyRoutine>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createDailyRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDailyRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDailyRoutine.fulfilled, (state, action: PayloadAction<DailyRoutine>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateDailyRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDailyRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDailyRoutine.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteDailyRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectDailyRoutines = (state: any) => state.dailyRoutines.items;
export const selectDailyRoutineLoading = (state: any) => state.dailyRoutines.loading;
export const selectDailyRoutineError = (state: any) => state.dailyRoutines.error;

export default dailyRoutineSlice.reducer; 