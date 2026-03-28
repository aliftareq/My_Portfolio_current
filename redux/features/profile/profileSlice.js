import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNK
// --------------------
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload profile image");
  },
);

// --------------------
// PROFILE THUNKS
// --------------------
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch profile",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (profileData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to save profile",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to delete profile",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
  message: null,

  mainImageLoading: false,
  uploadedImageUrl: "",
  mainImageError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedProfile: (state) => {
      state.profile = null;
    },

    clearProfileUploadedImage: (state) => {
      state.mainImageLoading = false;
      state.mainImageError = null;
      state.uploadedImageUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // PROFILE IMAGE
      .addCase(uploadProfileImage.pending, (state) => {
        state.mainImageLoading = true;
        state.mainImageError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.mainImageLoading = false;
        state.uploadedImageUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.mainImageLoading = false;
        state.mainImageError =
          action.payload || "Failed to upload profile image";
      })

      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })

      // SAVE PROFILE
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Profile saved successfully";
        state.profile = action.payload?.data || null;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to save profile";
      })

      // DELETE PROFILE
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Profile deleted successfully";
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete profile";
      });
  },
});

export const {
  clearProfileState,
  clearSelectedProfile,
  clearProfileUploadedImage,
} = profileSlice.actions;

export default profileSlice.reducer;