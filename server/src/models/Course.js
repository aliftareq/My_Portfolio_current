import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String, // e.g. "Udemy", "Coursera", "freeCodeCamp"
      required: true,
      trim: true,
    },

    platform: {
      type: String, // optional if provider is institution (e.g. "Harvard via edX")
      default: "",
      trim: true,
    },

    completionDate: {
      type: Date,
    },

    duration: {
      type: String, // e.g. "8 weeks", "40 hours"
      default: "",
    },

    skills: {
      type: [String], // 🔥 MOST IMPORTANT for resume
      default: [],
    },

    description: {
      type: String, // short summary
      default: "",
    },

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        projectLink: {
          type: String,
          default: "",
        },
      },
    ],

    certificate: {
      name: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },

    courseLink: {
      type: String, // original course link
      default: "",
    },

    thumbnail: {
      type: String, // course image/logo
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Course", courseSchema);