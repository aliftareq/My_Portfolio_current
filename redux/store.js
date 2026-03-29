import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./features/profile/profileSlice";
import projectReducer from "./features/project/projectSlice";
import jobExperienceReducer from "./features/jobExperience/jobExperienceSlice";
import contactReducer from "./features/contact/contactSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    project: projectReducer,
    jobExperience: jobExperienceReducer,
    // contact: contactReducer,
  },
});