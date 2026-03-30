import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageRequest } from "../shared/uploadImageHelper";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --------------------
// IMAGE UPLOAD THUNK
// --------------------
export const uploadSkillIcon = createAsyncThunk(
  "skills/uploadSkillIcon",
  async (file, thunkAPI) => {
    return uploadImageRequest(file, thunkAPI, "Failed to upload skill icon");
  }
);

// --------------------
// SKILL THUNKS
// --------------------

// GET ALL
export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/skills`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch skills");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// GET SINGLE
export const fetchSingleSkill = createAsyncThunk(
  "skills/fetchSingleSkill",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/skills/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch skill");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// CREATE
export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (skillData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to create skill");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// UPDATE
export const updateSkill = createAsyncThunk(
  "skills/updateSkill",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to update skill");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// DELETE
export const deleteSkill = createAsyncThunk(
  "skills/deleteSkill",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/skills/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to delete skill");
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
  skills: [],
  skill: null,
  loading: false,
  error: null,
  success: false,
  message: null,
  count: 0,

  iconImageLoading: false,
  uploadedIconUrl: "",
  iconImageError: null,
};

// --------------------
// SLICE
// --------------------
const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkillState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearSelectedSkill: (state) => {
      state.skill = null;
    },

    clearSkillUploadedIcon: (state) => {
      state.iconImageLoading = false;
      state.iconImageError = null;
      state.uploadedIconUrl = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ICON IMAGE
      .addCase(uploadSkillIcon.pending, (state) => {
        state.iconImageLoading = true;
        state.iconImageError = null;
      })
      .addCase(uploadSkillIcon.fulfilled, (state, action) => {
        state.iconImageLoading = false;
        state.uploadedIconUrl =
          action.payload?.result?.secure_url ||
          action.payload?.result?.url ||
          action.payload?.url ||
          "";
      })
      .addCase(uploadSkillIcon.rejected, (state, action) => {
        state.iconImageLoading = false;
        state.iconImageError =
          action.payload || "Failed to upload skill icon";
      })

      // FETCH ALL
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch skills";
      })

      // FETCH SINGLE
      .addCase(fetchSingleSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skill = action.payload?.data || null;
      })
      .addCase(fetchSingleSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch skill";
      })

      // CREATE
      .addCase(createSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Skill created successfully";

        const newSkill = action.payload?.data || null;
        state.skill = newSkill;

        if (newSkill) {
          state.skills.unshift(newSkill);
          state.count = state.skills.length;
        }
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to create skill";
      })

      // UPDATE
      .addCase(updateSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Skill updated successfully";

        const updatedSkill = action.payload?.data || null;
        state.skill = updatedSkill;

        if (updatedSkill) {
          state.skills = state.skills.map((item) =>
            item._id === updatedSkill._id ? updatedSkill : item
          );
          state.count = state.skills.length;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to update skill";
      })

      // DELETE
      .addCase(deleteSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Skill deleted successfully";

        state.skills = state.skills.filter(
          (item) => item._id !== action.payload.deletedId
        );

        state.count = state.skills.length;

        if (state.skill && state.skill._id === action.payload.deletedId) {
          state.skill = null;
        }
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete skill";
      });
  },
});

export const {
  clearSkillState,
  clearSelectedSkill,
  clearSkillUploadedIcon,
} = skillSlice.actions;

export default skillSlice.reducer;