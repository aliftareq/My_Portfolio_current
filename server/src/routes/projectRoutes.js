import express from "express";
import {
  getProjects,
  getSingleProject,
  getSingleProjectBySlug,
  createProject,
  updateSingleProject,
  deleteSingleProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/slug/:slug", getSingleProjectBySlug);
router.get("/:id", getSingleProject);
router.post("/", createProject);
router.put("/:id", updateSingleProject);
router.delete("/:id", deleteSingleProject);

export default router;