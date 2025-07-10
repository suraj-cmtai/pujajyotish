import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdOn?: string;
}

interface LeadState {
  items: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk<Lead[]>(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/leads/getLeads`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch leads');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch leads');
    }
  }
);

export const createLead = createAsyncThunk<Lead, any>(
  'leads/createLead',
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/leads/newLead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create lead');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk<Lead, { id: string; form: any }>(
  'leads/updateLead',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/leads/updateLead/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update lead');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk<string, string>(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/leads/deleteLead/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete lead');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete lead');
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectLeads = (state: any) => state.leads.items;
export const selectLeadLoading = (state: any) => state.leads.loading;
export const selectLeadError = (state: any) => state.leads.error;

export default leadSlice.reducer; 