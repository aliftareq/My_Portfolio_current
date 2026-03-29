import express from "express";
import {
  getAllJob,
  getSingleJob,
  createJobExperience,
  updateJob,
  deleteJob,
} from "../controllers/JobExperienceController.js";

const router = express.Router();

router.get("/", getAllJob);
router.get("/:id", getSingleJob);
router.post("/", createJobExperience);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
