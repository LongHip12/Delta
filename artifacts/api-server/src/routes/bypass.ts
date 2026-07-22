import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bypassStatsTable, apiKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

async function incrementBypassCount() {
  try {
    const [existing] = await db.select().from(bypassStatsTable).where(eq(bypassStatsTable.id, "global"));
    if (existing) {
      await db.update(bypassStatsTable).set({ totalBypassed: existing.totalBypassed + 1, updatedAt: new Date() }).where(eq(bypassStatsTable.id, "global"));
    } else {
      await db.insert(bypassStatsTable).values({ id: "global", totalBypassed: 1 });
    }
  } catch {}
}

async function validateApiKey(key: string): Promise<boolean> {
  if (!key) return false;
  const [found] = await db.select().from(apiKeysTable).where(eq(apiKeysTable.key, key));
  return !!found;
}

router.post("/bypass", async (req, res) => {
  const { url, lootResult } = req.body;
  if (!url || typeof url !== "string") {
    res.status(400).json({ success: false, error: "Missing 'url' field" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const send = (data: object) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      if (typeof (res as any).flush === "function") (res as any).flush();
    } catch {}
  };

  const onLog = (msg: string) => {
    send({ type: "log", msg });
  };

  try {
    const { runBypass } = await import("../lib/bypass/engine.js");
    const result = await runBypass(url.trim(), onLog, lootResult?.trim() || undefined);
    await incrementBypassCount();
    send({ type: "result", ...result });
  } catch (err: any) {
    send({ type: "result", success: false, error: "Server error: " + String(err?.message || err) });
  } finally {
    res.end();
  }
});

router.post("/bypass/bulk", async (req, res) => {
  const { urls, apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string") {
    res.status(401).json({ success: false, error: "API key required for bulk bypass" });
    return;
  }

  const valid = await validateApiKey(apiKey);
  if (!valid) {
    res.status(401).json({ success: false, error: "Invalid API key" });
    return;
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    res.status(400).json({ success: false, error: "Missing or empty 'urls' array" });
    return;
  }

  if (urls.length > 50) {
    res.status(400).json({ success: false, error: "Maximum 50 URLs per bulk request" });
    return;
  }

  const { runBypass } = await import("../lib/bypass/engine.js");

  const results = await Promise.all(
    urls.map(async (url: string) => {
      try {
        const result = await runBypass(url.trim(), () => {}, undefined);
        if (result.success) await incrementBypassCount();
        return { url, ...result };
      } catch {
        return { url, success: false, error: "Server error" };
      }
    })
  );

  res.json({ results });
});

export default router;
