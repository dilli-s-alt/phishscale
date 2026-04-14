import express from "express";
import multer from "multer";
import {
  createTarget,
  getTargets,
  uploadTargets,
  bulkCreateTargets,
  deleteTarget
} from "../controllers/targetController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), uploadTargets);
router.post("/bulk", bulkCreateTargets);
router.post("/", createTarget);
router.get("/", getTargets);
router.delete("/:id", deleteTarget);

export default router;
