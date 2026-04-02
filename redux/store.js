import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./features/profile/profileSlice";
import projectReducer from "./features/project/projectSlice";
import jobExperienceReducer from "./features/jobExperience/jobExperienceSlice";
import educationReducer from "./features/education/educationSlice";
import serviceReducer from "./features/service/serviceSlice";
import courseReducer from "./features/courses/courseSlice";
import skillReducer from "./features/skill/skillSlice";
import emailReducer from "./features/email/emailSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    project: projectReducer,
    jobExperience: jobExperienceReducer,
    education: educationReducer,
    service: serviceReducer,
    courses: courseReducer,
    skills: skillReducer,
    email: emailReducer,
  },
});
