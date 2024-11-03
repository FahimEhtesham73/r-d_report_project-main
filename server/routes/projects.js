import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getSingleProject,
  addTeamMember,
  removeTeamMember
} from "../controllers/projectController.js";

const router = express.Router();


router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getSingleProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post('/:projectId/add', addTeamMember);
router.delete('/:projectId/remove/:memberId', removeTeamMember);

export default router;
