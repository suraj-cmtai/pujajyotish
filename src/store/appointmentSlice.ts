import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  date: string;
  payment?: any;
}

interface AppointmentState {
  items: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk<Appointment[]>(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/appointments/getAppointments`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch appointments');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk<Appointment, any>(
  'appointments/createAppointment',
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/appointments/newAppointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create appointment');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk<Appointment, { id: string; form: any }>(
  'appointments/updateAppointment',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/appointments/updateAppointment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update appointment');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk<string, string>(
  'appointments/deleteAppointment',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/appointments/deleteAppointment/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete appointment');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAppointments = (state: any) => state.appointments.items;
export const selectAppointmentLoading = (state: any) => state.appointments.loading;
export const selectAppointmentError = (state: any) => state.appointments.error;

export default appointmentSlice.reducer; 