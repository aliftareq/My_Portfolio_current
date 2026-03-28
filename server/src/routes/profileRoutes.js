import express from "express";
import {
  getProfile,
  saveProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfile);
router.post("/save", saveProfile);
router.delete("/", deleteProfile);

export default router;
