import JobExperience from "../models/JobExperience.js";

// GET ALL JOB EXPERIENCES
export const getAllJob = async (req, res) => {
  try {
    const jobs = await JobExperience.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job experiences",
      error: error.message,
    });
  }
};

// GET SINGLE JOB BY ID
export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobExperience.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job experience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job experience",
      error: error.message,
    });
  }
};

// CREATE JOB EXPERIENCE
export const createJobExperience = async (req, res) => {
  try {
    const {
      companyName,
      jobTitle,
      location,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      description,
      responsibilities,
      achievements,
      technologies,
      companyLogo,
      slug,
    } = req.body;

    // optional duplicate slug check
    const existing = await JobExperience.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const job = await JobExperience.create({
      companyName,
      jobTitle,
      location,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      description,
      responsibilities,
      achievements,
      technologies,
      companyLogo,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Job experience created successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create job experience",
      error: error.message,
    });
  }
};

// UPDATE JOB EXPERIENCE
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      companyName,
      jobTitle,
      location,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      description,
      responsibilities,
      achievements,
      technologies,
      companyLogo,
      slug,
    } = req.body;

    const updatedJob = await JobExperience.findByIdAndUpdate(
      id,
      {
        companyName,
        jobTitle,
        location,
        employmentType,
        startDate,
        endDate,
        currentlyWorking,
        description,
        responsibilities,
        achievements,
        technologies,
        companyLogo,
        slug,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job experience updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update job experience",
      error: error.message,
    });
  }
};

// DELETE JOB EXPERIENCE
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await JobExperience.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job experience deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job experience",
      error: error.message,
    });
  }
};
