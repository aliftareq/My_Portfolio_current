import Profile from "../models/Profile.js";
import { fetchGithubCommitTotal } from "../utils/githubService.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// GET GITHUB COMMIT COUNT
export const getGithubCommitCount = async (req, res) => {
  try {
    const totalCommits = await fetchGithubCommitTotal();

    res.status(200).json({
      success: true,
      data: {
        totalCommits,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub commit count",
      error: error.message,
    });
  }
};

// CREATE OR UPDATE PROFILE
export const saveProfile = async (req, res) => {
  try {
    const {
      name,
      role,
      description,
      profileImage,
      resumeUrl,
      email,
      phone,
      skype,
      experience,
      nationality,
      freelance,
      currentAddress,
      permanentAddress,
      languages,
      githubUrl,
      linkedinUrl,
      youtubeUrl,
      twitterUrl,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      {},
      {
        name,
        role,
        description,
        profileImage,
        resumeUrl,
        email,
        phone,
        skype,
        experience,
        nationality,
        freelance,
        currentAddress,
        permanentAddress,
        languages: Array.isArray(languages)
          ? languages
          : typeof languages === "string"
            ? languages.split(",").map((lang) => lang.trim())
            : [],
        socials: {
          github: githubUrl || "",
          linkedin: linkedinUrl || "",
          youtube: youtubeUrl || "",
          twitter: twitterUrl || "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message,
    });
  }
};

// DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
};
