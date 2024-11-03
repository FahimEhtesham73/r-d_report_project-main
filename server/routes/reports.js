import express from "express";
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
  getSingleReport
} from "../controllers/reportController.js";
import multer from 'multer';
// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


const router = express.Router();

// Route for creating a report with file uploads
router.post("/", upload.array('files'), createReport);
router.get("/:project", getReports);
router.get("/report/:report", getSingleReport);

router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;
