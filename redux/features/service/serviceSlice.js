import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNK
// --------------------
export const uploadServiceLogo = createAsyncThunk(
  "service/uploadServiceLogo",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload service logo");
  }
);

// --------------------
// SERVICE THUNKS
// --------------------

// GET ALL
export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch services"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// GET SINGLE
export const fetchSingleService = createAsyncThunk(
  "service/fetchSingleService",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch service"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// CREATE
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create service"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// UPDATE
export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to update service"
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// DELETE
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to delete service"
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
  services: [],
  service: null,
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
const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearServiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedService: (state) => {
      state.service = null;
    },

    clearServiceUploadedLogo: (state) => {
      state.logoImageLoading = false;
      state.logoImageError = null;
      state.uploadedLogoUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGO IMAGE
      .addCase(uploadServiceLogo.pending, (state) => {
        state.logoImageLoading = true;
        state.logoImageError = null;
      })
      .addCase(uploadServiceLogo.fulfilled, (state, action) => {
        state.logoImageLoading = false;
        state.uploadedLogoUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadServiceLogo.rejected, (state, action) => {
        state.logoImageLoading = false;
        state.logoImageError =
          action.payload || "Failed to upload service logo";
      })

      // FETCH ALL
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch services";
      })

      // FETCH SINGLE
      .addCase(fetchSingleService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleService.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload?.data || null;
      })
      .addCase(fetchSingleService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch service";
      })

      // CREATE
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Service created successfully";

        const newService = action.payload?.data || null;
        state.service = newService;

        if (newService) {
          state.services.unshift(newService);
          state.count = state.services.length;
        }
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create service";
      })

      // UPDATE
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Service updated successfully";

        const updatedService = action.payload?.data || null;
        state.service = updatedService;

        if (updatedService) {
          state.services = state.services.map((item) =>
            item._id === updatedService._id ? updatedService : item
          );
          state.count = state.services.length;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update service";
      })

      // DELETE
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Service deleted successfully";

        state.services = state.services.filter(
          (item) => item._id !== action.payload.deletedId
        );

        state.count = state.services.length;

        if (state.service && state.service._id === action.payload.deletedId) {
          state.service = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete service";
      });
  },
});

export const {
  clearServiceState,
  clearSelectedService,
  clearServiceUploadedLogo,
} = serviceSlice.actions;

export default serviceSlice.reducer;