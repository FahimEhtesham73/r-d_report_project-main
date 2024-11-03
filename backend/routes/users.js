import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  changeUserRole
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put('/:id/role', changeUserRole);

export default router;
