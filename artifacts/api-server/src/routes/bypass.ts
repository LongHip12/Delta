import { Router, type IRouter } from "express";
import { BypassLinkBody, BypassBulkBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { bypassStatsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SUPPORTED_DOMAINS: Record<string, string> = {
  "linkvertise.com": "Linkvertise",
  "lootlabs.gg": "Lootlabs",
  "work.ink": "Work.ink",
  "platoboost.com": "Platoboost",
  "pandadevelopment.net": "PandaDevelopment",
  "trigonevo.com": "Trigon Evo",
  "violated.lol": "Violated",
  "blox-script.com": "Blox Script",
  "hydrogen.lat": "Hydrogen",
  "key.codex.lol": "Codex",
};

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

function detectService(url: string): string | null {
  for (const [domain, name] of Object.entries(SUPPORTED_DOMAINS)) {
    if (url.includes(domain)) return name;
  }
  return null;
}

router.post("/bypass", async (req, res) => {
  const parsed = BypassLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { url } = parsed.data;
  const service = detectService(url);
  if (!service) {
    res.status(400).json({ error: "Unsupported link. Check /api/supported for the full list." });
    return;
  }
  await incrementBypassCount();
  res.json({
    success: true,
    destination: `https://bypass-result.example.com/${Math.random().toString(36).slice(2)}`,
    service,
    cached: false,
  });
});

router.post("/bypass/bulk", async (req, res) => {
  const parsed = BypassBulkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { urls } = parsed.data;
  const results = await Promise.all(
    urls.map(async (url) => {
      const service = detectService(url);
      if (!service) {
        return { success: false, destination: "", service: null, cached: false };
      }
      await incrementBypassCount();
      return {
        success: true,
        destination: `https://bypass-result.example.com/${Math.random().toString(36).slice(2)}`,
        service,
        cached: false,
      };
    })
  );
  res.json({ results });
});

export default router;
