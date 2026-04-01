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
      const payload = {
        name: profileData.name || "",
        role: profileData.role || "",
        description: profileData.description || "",
        profileImage: profileData.profileImage || "",
        resumeUrl: profileData.resumeUrl || "",

        email: profileData.email || "",
        phone: profileData.phone || "",
        skype: profileData.skype || "",
        experience: profileData.experience || "",
        nationality: profileData.nationality || "",
        freelance: profileData.freelance || "",
        currentAddress: profileData.currentAddress || "",
        permanentAddress: profileData.permanentAddress || "",
        languages: Array.isArray(profileData.languages)
          ? profileData.languages
          : typeof profileData.languages === "string"
            ? profileData.languages.split(",").map((lang) => lang.trim())
            : [],

        githubUrl: profileData.githubUrl || profileData.socials?.github || "",
        linkedinUrl:
          profileData.linkedinUrl || profileData.socials?.linkedin || "",
        youtubeUrl:
          profileData.youtubeUrl || profileData.socials?.youtube || "",
        twitterUrl:
          profileData.twitterUrl || profileData.socials?.twitter || "",
      };

      const response = await fetch(`${BASE_URL}/api/profile/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

// --------------------
// GITHUB COMMIT COUNT THUNK
// --------------------
export const fetchGithubCommitCount = createAsyncThunk(
  "profile/fetchGithubCommitCount",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/github-commits`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch GitHub commit count",
        );
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  },
);

const initialState = {
  profile: {
    name: "",
    role: "",
    description: "",
    profileImage: "",
    resumeUrl: "",

    email: "",
    phone: "",
    skype: "",
    experience: "",
    nationality: "",
    freelance: "",
    currentAddress: "",
    permanentAddress: "",
    languages: [],

    socials: {
      github: "",
      linkedin: "",
      youtube: "",
      twitter: "",
    },
  },

  githubCommitCount: 0,
  githubCommitLoading: false,
  githubCommitError: null,

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
      state.profile = initialState.profile;
    },

    clearProfileUploadedImage: (state) => {
      state.mainImageLoading = false;
      state.mainImageError = null;
      state.uploadedImageUrl = "";
    },

    clearGithubCommitState: (state) => {
      state.githubCommitLoading = false;
      state.githubCommitError = null;
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
        state.profile = {
          ...initialState.profile,
          ...action.payload?.data,
          socials: {
            ...initialState.profile.socials,
            ...(action.payload?.data?.socials || {}),
          },
          languages: Array.isArray(action.payload?.data?.languages)
            ? action.payload.data.languages
            : [],
        };
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
        state.profile = {
          ...initialState.profile,
          ...action.payload?.data,
          socials: {
            ...initialState.profile.socials,
            ...(action.payload?.data?.socials || {}),
          },
          languages: Array.isArray(action.payload?.data?.languages)
            ? action.payload.data.languages
            : [],
        };
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
        state.profile = initialState.profile;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to delete profile";
      })

      // FETCH GITHUB COMMIT COUNT
      .addCase(fetchGithubCommitCount.pending, (state) => {
        state.githubCommitLoading = true;
        state.githubCommitError = null;
      })
      .addCase(fetchGithubCommitCount.fulfilled, (state, action) => {
        state.githubCommitLoading = false;
        state.githubCommitCount = action.payload?.data?.totalCommits || 0;
      })
      .addCase(fetchGithubCommitCount.rejected, (state, action) => {
        state.githubCommitLoading = false;
        state.githubCommitError =
          action.payload || "Failed to fetch GitHub commit count";
      });
  },
});

export const {
  clearProfileState,
  clearSelectedProfile,
  clearProfileUploadedImage,
  clearGithubCommitState,
} = profileSlice.actions;

export default profileSlice.reducer;
