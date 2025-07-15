import { Router } from "express";
import { getPartnerData } from "@/controllers/publicController";

const router = Router();

router.get("/data", getPartnerData);

export default router;
