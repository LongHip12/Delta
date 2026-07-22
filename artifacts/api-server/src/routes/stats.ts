import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bypassStatsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  let totalBypassed = 1_240_000;
  try {
    const [row] = await db.select().from(bypassStatsTable).where(eq(bypassStatsTable.id, "global"));
    if (row) totalBypassed = row.totalBypassed;
  } catch {}
  res.json({
    totalBypassed,
    totalServices: 14,
    uptime: "99.9%",
  });
});

export default router;
