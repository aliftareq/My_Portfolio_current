import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNKS
// --------------------
export const uploadJobExperienceLogo = createAsyncThunk(
  "jobExperience/uploadJobExperienceLogo",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload company logo");
  },
);

// --------------------
// JOB EXPERIENCE THUNKS
// --------------------

// GET ALL
export const fetchJobExperiences = createAsyncThunk(
  "jobExperience/fetchJobExperiences",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/job-experiences`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch job experiences",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// GET SINGLE
export const fetchSingleJob = createAsyncThunk(
  "jobExperience/fetchSingleJob",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/job-experiences/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch job experience",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// CREATE
export const createJobExperience = createAsyncThunk(
  "jobExperience/createJobExperience",
  async (jobData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/job-experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create job experience",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// UPDATE
export const updateJobExperience = createAsyncThunk(
  "jobExperience/updateJobExperience",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/job-experiences/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to update job experience",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// DELETE
export const deleteJobExperience = createAsyncThunk(
  "jobExperience/deleteJobExperience",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/job-experiences/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to delete job experience",
        );
      }

      return { ...data, deletedId: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// --------------------
// INITIAL STATE
// --------------------
const initialState = {
  jobs: [],
  job: null,
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
const jobExperienceSlice = createSlice({
  name: "jobExperience",
  initialState,
  reducers: {
    clearJobState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedJob: (state) => {
      state.job = null;
    },

    clearJobExperienceUploadedLogo: (state) => {
      state.logoImageLoading = false;
      state.logoImageError = null;
      state.uploadedLogoUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGO IMAGE
      .addCase(uploadJobExperienceLogo.pending, (state) => {
        state.logoImageLoading = true;
        state.logoImageError = null;
      })
      .addCase(uploadJobExperienceLogo.fulfilled, (state, action) => {
        state.logoImageLoading = false;
        state.uploadedLogoUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadJobExperienceLogo.rejected, (state, action) => {
        state.logoImageLoading = false;
        state.logoImageError =
          action.payload || "Failed to upload company logo";
      })

      // FETCH ALL
      .addCase(fetchJobExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(fetchJobExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch job experiences";
      })

      // FETCH SINGLE
      .addCase(fetchSingleJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload?.data || null;
      })
      .addCase(fetchSingleJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch job experience";
      })

      // CREATE
      .addCase(createJobExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createJobExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Job experience created successfully";

        const newJob = action.payload?.data || null;
        state.job = newJob;

        if (newJob) {
          state.jobs.unshift(newJob);
          state.count = state.jobs.length;
        }
      })
      .addCase(createJobExperience.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create job experience";
      })

      // UPDATE
      .addCase(updateJobExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateJobExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Job experience updated successfully";

        const updatedJob = action.payload?.data || null;
        state.job = updatedJob;

        if (updatedJob) {
          state.jobs = state.jobs.map((item) =>
            item._id === updatedJob._id ? updatedJob : item,
          );
          state.count = state.jobs.length;
        }
      })
      .addCase(updateJobExperience.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update job experience";
      })

      // DELETE
      .addCase(deleteJobExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteJobExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Job experience deleted successfully";

        state.jobs = state.jobs.filter(
          (item) => item._id !== action.payload.deletedId,
        );

        state.count = state.jobs.length;

        if (state.job && state.job._id === action.payload.deletedId) {
          state.job = null;
        }
      })
      .addCase(deleteJobExperience.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete job experience";
      });
  },
});

export const {
  clearJobState,
  clearSelectedJob,
  clearJobExperienceUploadedLogo,
} = jobExperienceSlice.actions;

export default jobExperienceSlice.reducer;