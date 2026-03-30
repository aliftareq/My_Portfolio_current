import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String, // e.g. "Frontend", "Backend", "Database", "DevOps"
      default: "",
      trim: true,
    },

    proficiency: {
      type: String, // e.g. "Beginner", "Intermediate", "Advanced", "Expert"
      default: "",
      trim: true,
    },

    experience: {
      type: String, // e.g. "2 years", "6 months"
      default: "",
      trim: true,
    },

    icon: {
      type: String, // skill logo/icon
      default: "",
      trim: true,
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
  { timestamps: true },
);

export default mongoose.model("Skill", skillSchema);
