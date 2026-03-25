import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNKS
// --------------------
export const uploadProjectMainImage = createAsyncThunk(
  "project/uploadProjectMainImage",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("my_file", file);

      const response = await fetch(`${BASE_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to upload main image",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Something went wrong while uploading main image",
      );
    }
  },
);

export const uploadProjectGalleryImage = createAsyncThunk(
  "project/uploadProjectGalleryImage",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("my_file", file);

      const response = await fetch(`${BASE_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to upload gallery image",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Something went wrong while uploading gallery image",
      );
    }
  },
);

// --------------------
// PROJECT THUNKS
// --------------------
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`);
      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch projects",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const fetchSingleProject = createAsyncThunk(
  "project/fetchSingleProject",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch project",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const fetchSingleProjectBySlug = createAsyncThunk(
  "project/fetchSingleProjectBySlug",
  async (slug, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/slug/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch project",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to create project",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to update project",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to delete project",
        );
      }

      return { ...data, deletedId: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

const initialState = {
  projects: [],
  project: null,
  loading: false,
  error: null,
  success: false,
  message: null,
  count: 0,

  mainImageLoading: false,
  uploadedImageUrl: "",
  mainImageError: null,

  galleryImageLoading: false,
  galleryImages: [],
  galleryImageError: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    clearSelectedProject: (state) => {
      state.project = null;
    },
    clearUploadedImage: (state) => {
      state.mainImageLoading = false;
      state.mainImageError = null;
      state.uploadedImageUrl = "";
    },
    clearGalleryImages: (state) => {
      state.galleryImageLoading = false;
      state.galleryImageError = null;
      state.galleryImages = [];
    },
    removeGalleryImage: (state, action) => {
      state.galleryImages = state.galleryImages.filter(
        (_, index) => index !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // MAIN IMAGE
      .addCase(uploadProjectMainImage.pending, (state) => {
        state.mainImageLoading = true;
        state.mainImageError = null;
      })
      .addCase(uploadProjectMainImage.fulfilled, (state, action) => {
        state.mainImageLoading = false;
        state.mainImageError = null;
        state.uploadedImageUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          "";
      })
      .addCase(uploadProjectMainImage.rejected, (state, action) => {
        state.mainImageLoading = false;
        state.mainImageError = action.payload || "Failed to upload main image";
        state.uploadedImageUrl = "";
      })

      // GALLERY IMAGE
      .addCase(uploadProjectGalleryImage.pending, (state) => {
        state.galleryImageLoading = true;
        state.galleryImageError = null;
      })
      .addCase(uploadProjectGalleryImage.fulfilled, (state, action) => {
        state.galleryImageLoading = false;
        state.galleryImageError = null;

        const imageUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          "";

        if (imageUrl) {
          state.galleryImages.push(imageUrl);
        }
      })
      .addCase(uploadProjectGalleryImage.rejected, (state, action) => {
        state.galleryImageLoading = false;
        state.galleryImageError =
          action.payload || "Failed to upload gallery image";
      })

      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data || [];
        state.count = action.payload.count || 0;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })

      // fetchSingleProject
      .addCase(fetchSingleProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.data || null;
      })
      .addCase(fetchSingleProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch project";
      })

      // fetchSingleProjectBySlug
      .addCase(fetchSingleProjectBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProjectBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.data || null;
      })
      .addCase(fetchSingleProjectBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch project";
      })

      // createProject
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload.message || "Project created successfully";
        state.project = action.payload.data || null;

        if (action.payload.data) {
          state.projects.unshift(action.payload.data);
          state.count += 1;
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create project";
      })

      // updateProject
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload.message || "Project updated successfully";
        state.project = action.payload.data || null;

        const updatedProject = action.payload.data;
        if (updatedProject) {
          state.projects = state.projects.map((item) =>
            item._id === updatedProject._id ? updatedProject : item,
          );
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update project";
      })

      // deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload.message || "Project deleted successfully";
        state.projects = state.projects.filter(
          (item) => item._id !== action.payload.deletedId,
        );
        state.count = state.projects.length;

        if (state.project && state.project._id === action.payload.deletedId) {
          state.project = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete project";
      });
  },
});

export const {
  clearProjectState,
  clearSelectedProject,
  clearUploadedImage,
  clearGalleryImages,
  removeGalleryImage,
} = projectSlice.actions;

export default projectSlice.reducer;
