import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  status?: string;
}

interface ServiceState {
  items: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk<Service[]>(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/services/getService`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch services');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk<Service, any>(
  'services/createService',
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/services/newData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create service');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk<Service, { id: string; form: any }>(
  'services/updateService',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/services/updateService/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update service');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk<string, string>(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/services/deleteService/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete service');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectServices = (state: any) => state.services.items;
export const selectServiceLoading = (state: any) => state.services.loading;
export const selectServiceError = (state: any) => state.services.error;

export default serviceSlice.reducer; 