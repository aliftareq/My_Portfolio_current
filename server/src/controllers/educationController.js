import Education from "../models/Education.js";

// GET ALL EDUCATION ENTRIES
export const getAllEducation = async (req, res) => {
  try {
    const educationList = await Education.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: educationList.length,
      data: educationList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch education entries",
      error: error.message,
    });
  }
};

// GET SINGLE EDUCATION BY ID
export const getSingleEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch education entry",
      error: error.message,
    });
  }
};

// CREATE EDUCATION
export const createEducation = async (req, res) => {
  try {
    const {
      institutionName,
      degree,
      fieldOfStudy,
      location,
      startDate,
      endDate,
      currentlyStudying,
      grade,
      honors,
      relevantCoursework,
      projects,
      description,
      institutionLogo,
      slug,
    } = req.body;

    const existing = await Education.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const education = await Education.create({
      institutionName,
      degree,
      fieldOfStudy,
      location,
      startDate,
      endDate,
      currentlyStudying,
      grade,
      honors,
      relevantCoursework,
      projects,
      description,
      institutionLogo,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: education,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create education entry",
      error: error.message,
    });
  }
};

// UPDATE EDUCATION
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      institutionName,
      degree,
      fieldOfStudy,
      location,
      startDate,
      endDate,
      currentlyStudying,
      grade,
      honors,
      relevantCoursework,
      projects,
      description,
      institutionLogo,
      slug,
    } = req.body;

    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      {
        institutionName,
        degree,
        fieldOfStudy,
        location,
        startDate,
        endDate,
        currentlyStudying,
        grade,
        honors,
        relevantCoursework,
        projects,
        description,
        institutionLogo,
        slug,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEducation) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: updatedEducation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update education entry",
      error: error.message,
    });
  }
};

// DELETE EDUCATION
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
      data: deletedEducation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete education entry",
      error: error.message,
    });
  }
};