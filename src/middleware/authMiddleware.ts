import env from "@/config/ENV";
import { Request, Response, NextFunction } from "express";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    if (token !== env.ADMIN_API_KEY) {
      return res.status(403).json({ message: "Forbidden: Invalid admin token" });
    }
    next();
  };