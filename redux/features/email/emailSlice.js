import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendEmail = createAsyncThunk(
  'email/sendEmail',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/email/send-email',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send email'
      );
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    loading: false,
    success: false,
    message: '',
    error: null,
  },
  reducers: {
    resetEmailState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;