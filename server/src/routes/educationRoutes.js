import express from "express";
import {
  getAllEducation,
  getSingleEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

const router = express.Router();

router.get("/", getAllEducation);
router.get("/:id", getSingleEducation);
router.post("/", createEducation);
router.put("/:id", updateEducation);
router.delete("/:id", deleteEducation);

export default router;
