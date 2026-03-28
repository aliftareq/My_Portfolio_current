import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    profileImage: {
      type: String,
      required: [true, "Profile image is required"],
      trim: true,
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },

    socials: {
      github: {
        type: String,
        trim: true,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
      youtube: {
        type: String,
        trim: true,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent model overwrite in dev (Next.js hot reload fix)
const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;