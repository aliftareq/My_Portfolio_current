import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./features/project/projectSlice";
import profileReducer from "./features/profile/profileSlice";
import contactReducer from "./features/contact/contactSlice";
import biodataReducer from "./features/biodata/biodataSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    // profile: profileReducer,
    // contact: contactReducer,
    // biodata: biodataReducer,
  },
});