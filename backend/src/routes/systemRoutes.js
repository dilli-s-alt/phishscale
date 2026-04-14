import express from "express";
import { resetSystem } from "../controllers/systemController.js";

const router = express.Router();

router.post("/reset", resetSystem);

export default router;
