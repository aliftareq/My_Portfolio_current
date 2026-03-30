import Course from "../models/Course.js";

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courseList.length,
      data: courseList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// GET SINGLE COURSE BY ID
export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      provider,
      platform,
      completionDate,
      duration,
      skills,
      description,
      projects,
      certificate,
      courseLink,
      thumbnail,
      isFeatured,
      slug,
    } = req.body;

    const existing = await Course.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const course = await Course.create({
      title,
      provider,
      platform,
      completionDate,
      duration,
      skills,
      description,
      projects,
      certificate,
      courseLink,
      thumbnail,
      isFeatured,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      provider,
      platform,
      completionDate,
      duration,
      skills,
      description,
      projects,
      certificate,
      courseLink,
      thumbnail,
      isFeatured,
      slug,
    } = req.body;

    if (slug) {
      const existing = await Course.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        provider,
        platform,
        completionDate,
        duration,
        skills,
        description,
        projects,
        certificate,
        courseLink,
        thumbnail,
        isFeatured,
        slug,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};