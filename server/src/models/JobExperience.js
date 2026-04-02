import mongoose from "mongoose";

const jobExperienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null, 
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    responsibilities: {
      type: [String], // bullet points
      default: [],
    },

    achievements: {
      type: [String], // impact-based points
      default: [],
    },

    technologies: {
      type: [String], // similar to techStack
      default: [],
    },

    companyLogo: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobExperience", jobExperienceSchema);