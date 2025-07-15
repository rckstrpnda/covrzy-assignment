import { Router } from "express";
import { adminAuth } from "@/middleware/authMiddleware";
import { createPartner, getUsage, healthCheck, updateUsage } from "@/controllers/adminController";

const router = Router();

router.post("/create-partner", adminAuth, createPartner);
router.get("/health-check",adminAuth, healthCheck);
router.get("/usage/:partnerId",adminAuth, getUsage);
router.put("/partners",adminAuth, updateUsage);
export default router;
