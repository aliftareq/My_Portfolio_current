import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNK
// --------------------
export const uploadCourseThumbnail = createAsyncThunk(
  "courses/uploadCourseThumbnail",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload course thumbnail");
  }
);

// --------------------
// COURSE THUNKS
// --------------------

// GET ALL
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch courses");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// GET SINGLE
export const fetchSingleCourse = createAsyncThunk(
  "courses/fetchSingleCourse",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch course");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// CREATE
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to create course");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// UPDATE
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to update course");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// DELETE
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/courses/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to delete course");
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
  courses: [],
  course: null,
  loading: false,
  error: null,
  success: false,
  message: null,
  count: 0,

  thumbnailImageLoading: false,
  uploadedThumbnailUrl: "",
  thumbnailImageError: null,
};

// --------------------
// SLICE
// --------------------
const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedCourse: (state) => {
      state.course = null;
    },

    clearCourseUploadedThumbnail: (state) => {
      state.thumbnailImageLoading = false;
      state.thumbnailImageError = null;
      state.uploadedThumbnailUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // THUMBNAIL IMAGE
      .addCase(uploadCourseThumbnail.pending, (state) => {
        state.thumbnailImageLoading = true;
        state.thumbnailImageError = null;
      })
      .addCase(uploadCourseThumbnail.fulfilled, (state, action) => {
        state.thumbnailImageLoading = false;
        state.uploadedThumbnailUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadCourseThumbnail.rejected, (state, action) => {
        state.thumbnailImageLoading = false;
        state.thumbnailImageError =
          action.payload || "Failed to upload course thumbnail";
      })

      // FETCH ALL
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses";
      })

      // FETCH SINGLE
      .addCase(fetchSingleCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload?.data || null;
      })
      .addCase(fetchSingleCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch course";
      })

      // CREATE
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Course created successfully";

        const newCourse = action.payload?.data || null;
        state.course = newCourse;

        if (newCourse) {
          state.courses.unshift(newCourse);
          state.count = state.courses.length;
        }
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create course";
      })

      // UPDATE
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Course updated successfully";

        const updatedCourse = action.payload?.data || null;
        state.course = updatedCourse;

        if (updatedCourse) {
          state.courses = state.courses.map((item) =>
            item._id === updatedCourse._id ? updatedCourse : item
          );
          state.count = state.courses.length;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update course";
      })

      // DELETE
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Course deleted successfully";

        state.courses = state.courses.filter(
          (item) => item._id !== action.payload.deletedId
        );

        state.count = state.courses.length;

        if (state.course && state.course._id === action.payload.deletedId) {
          state.course = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete course";
      });
  },
});

export const {
  clearCourseState,
  clearSelectedCourse,
  clearCourseUploadedThumbnail,
} = courseSlice.actions;

export default courseSlice.reducer;