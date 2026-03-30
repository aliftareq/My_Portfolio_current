import Skill from "../models/Skill.js";

// GET ALL SKILLS
export const getAllSkills = async (req, res) => {
  try {
    const skillList = await Skill.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: skillList.length,
      data: skillList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

// GET SINGLE SKILL BY ID
export const getSingleSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
      error: error.message,
    });
  }
};

// CREATE SKILL
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, experience, icon, isFeatured, slug } =
      req.body;

    const existing = await Skill.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const skill = await Skill.create({
      name,
      category,
      proficiency,
      experience,
      icon,
      isFeatured,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create skill",
      error: error.message,
    });
  }
};

// UPDATE SKILL
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, proficiency, experience, icon, isFeatured, slug } =
      req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      {
        name,
        category,
        proficiency,
        experience,
        icon,
        isFeatured,
        slug,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update skill",
      error: error.message,
    });
  }
};

// DELETE SKILL
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: deletedSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};
