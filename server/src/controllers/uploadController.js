import { imageUploadUtil } from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await imageUploadUtil(dataURI);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    console.error("Error uploading image:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};