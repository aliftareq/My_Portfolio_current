import express from "express";
import {
  getAllSkills,
  getSingleSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const router = express.Router();

router.get("/", getAllSkills);
router.get("/:id", getSingleSkill);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
