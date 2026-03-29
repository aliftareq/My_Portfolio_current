import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String, // e.g. "Bachelor of Science"
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String, // e.g. "Computer Science"
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null, // null = ongoing
    },

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    grade: {
      type: String, // flexible for GPA/CGPA (e.g. "3.75/4.00")
      default: "",
    },

    honors: {
      type: [String], // e.g. ["Dean’s List", "Scholarship"]
      default: [],
    },

    relevantCoursework: {
      type: [String],
      default: [],
    },

    projects: {
      type: [
        {
          title: String,
          description: String,
        },
      ],
      default: [],
    },

    description: {
      type: String, // optional summary
      default: "",
    },

    institutionLogo: {
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
  { timestamps: true },
);

export default mongoose.model("Education", educationSchema);
