import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNK
// --------------------
export const uploadEducationLogo = createAsyncThunk(
  "education/uploadEducationLogo",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload institution logo");
  }
);

// --------------------
// EDUCATION THUNKS
// --------------------

// GET ALL
export const fetchEducations = createAsyncThunk(
  "education/fetchEducations",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/education`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch education"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// GET SINGLE
export const fetchSingleEducation = createAsyncThunk(
  "education/fetchSingleEducation",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/education/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch education"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// CREATE
export const createEducation = createAsyncThunk(
  "education/createEducation",
  async (educationData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create education"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// UPDATE
export const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/education/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to update education"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// DELETE
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/education/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to delete education"
        );
      }

      return { ...data, deletedId: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// --------------------
// INITIAL STATE
// --------------------
const initialState = {
  educations: [],
  education: null,
  loading: false,
  error: null,
  success: false,
  message: null,
  count: 0,

  logoImageLoading: false,
  uploadedLogoUrl: "",
  logoImageError: null,
};

// --------------------
// SLICE
// --------------------
const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    clearEducationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedEducation: (state) => {
      state.education = null;
    },

    clearEducationUploadedLogo: (state) => {
      state.logoImageLoading = false;
      state.logoImageError = null;
      state.uploadedLogoUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGO IMAGE
      .addCase(uploadEducationLogo.pending, (state) => {
        state.logoImageLoading = true;
        state.logoImageError = null;
      })
      .addCase(uploadEducationLogo.fulfilled, (state, action) => {
        state.logoImageLoading = false;
        state.uploadedLogoUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadEducationLogo.rejected, (state, action) => {
        state.logoImageLoading = false;
        state.logoImageError =
          action.payload || "Failed to upload institution logo";
      })

      // FETCH ALL
      .addCase(fetchEducations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch education";
      })

      // FETCH SINGLE
      .addCase(fetchSingleEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload?.data || null;
      })
      .addCase(fetchSingleEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch education";
      })

      // CREATE
      .addCase(createEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Education created successfully";

        const newEducation = action.payload?.data || null;
        state.education = newEducation;

        if (newEducation) {
          state.educations.unshift(newEducation);
          state.count = state.educations.length;
        }
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create education";
      })

      // UPDATE
      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Education updated successfully";

        const updatedEducation = action.payload?.data || null;
        state.education = updatedEducation;

        if (updatedEducation) {
          state.educations = state.educations.map((item) =>
            item._id === updatedEducation._id ? updatedEducation : item
          );
          state.count = state.educations.length;
        }
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update education";
      })

      // DELETE
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Education deleted successfully";

        state.educations = state.educations.filter(
          (item) => item._id !== action.payload.deletedId
        );

        state.count = state.educations.length;

        if (state.education && state.education._id === action.payload.deletedId) {
          state.education = null;
        }
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete education";
      });
  },
});

export const {
  clearEducationState,
  clearSelectedEducation,
  clearEducationUploadedLogo,
} = educationSlice.actions;

export default educationSlice.reducer;