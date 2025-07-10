import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from "@/config/api";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  blogImage?: string;
  videoUrl?: string;
  type?: string;
  createdAt?: string;
}

interface BlogState {
  items: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBlogs = createAsyncThunk<Blog[]>(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/blogs/getBlogs`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch blogs');
      return data.data || [];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch blogs');
    }
  }
);

export const createBlog = createAsyncThunk<Blog, any>(
  'blogs/createBlog',
  async (form, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key.endsWith('File') && value) {
          formData.append('media', value as File);
        } else if (!key.endsWith('File')) {
          formData.append(key, value as string);
        }
      });
      const res = await fetch(`${API_URL}/v1/blogs/newBlog`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create blog');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk<Blog, { id: string; form: any }>(
  'blogs/updateBlog',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key.endsWith('File') && value) {
          formData.append('media', value as File);
        } else if (!key.endsWith('File')) {
          formData.append(key, value as string);
        }
      });
      const res = await fetch(`${API_URL}/v1/blogs/updateBlog/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update blog');
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk<string, string>(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/v1/blogs/deleteBlog/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete blog');
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete blog');
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectBlogs = (state: any) => state.blogs.items;
export const selectBlogLoading = (state: any) => state.blogs.loading;
export const selectBlogError = (state: any) => state.blogs.error;

export default blogSlice.reducer; 