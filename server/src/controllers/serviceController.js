import Service from "../models/Service.js";

// GET ALL SERVICES
export const getAllServices = async (req, res) => {
  try {
    const serviceList = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: serviceList.length,
      data: serviceList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// GET SINGLE SERVICE BY ID
export const getSingleService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// CREATE SERVICE
export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      icon,
      link,
      isActive,
    } = req.body;

    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const service = await Service.create({
      title,
      description,
      slug,
      icon,
      link,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// UPDATE SERVICE
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      slug,
      icon,
      link,
      isActive,
    } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title,
        description,
        slug,
        icon,
        link,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// DELETE SERVICE
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};