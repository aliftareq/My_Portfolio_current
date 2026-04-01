import express from "express";
import {
  getProfile,
  saveProfile,
  deleteProfile,
  getGithubCommitCount,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfile);
router.get("/github-commits", getGithubCommitCount);
router.post("/save", saveProfile);
router.delete("/", deleteProfile);

export default router;
