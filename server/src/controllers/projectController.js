import Project from "../models/Project.js";

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// GET SINGLE BY ID
export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// GET SINGLE BY SLUG
export const getSingleProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// CREATE PROJECT ✅ UPDATED
export const createProject = async (req, res) => {
  try {
    const {
      category,
      subCategory, // ✅ NEW
      title,
      slug,
      description,
      techStack,
      mainImage,
      gallery,
      liveUrl,
      githubUrl,
      featured,
    } = req.body;

    // 🔥 optional: check duplicate slug
    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const project = await Project.create({
      category,
      subCategory, // ✅ SAVE IT
      title,
      slug,
      description,
      techStack,
      mainImage,
      gallery,
      liveUrl,
      githubUrl,
      featured,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// UPDATE PROJECT ✅ UPDATED
export const updateSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category,
      subCategory, // ✅ NEW
      title,
      slug,
      description,
      techStack,
      mainImage,
      gallery,
      liveUrl,
      githubUrl,
      featured,
    } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        category,
        subCategory, // ✅ UPDATE IT
        title,
        slug,
        description,
        techStack,
        mainImage,
        gallery,
        liveUrl,
        githubUrl,
        featured,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// DELETE PROJECT
export const deleteSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};
