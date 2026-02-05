import { Router } from "express";
import { prisma } from "../config/db";

const router = Router();

router.get("/hello", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Prisma raw query error:", err);
    res.status(500).json({ error: err?.message });
  }
});

export default router;
