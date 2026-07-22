import { Router, type IRouter } from "express";
import { CreateApiKeyBody, DeleteApiKeyParams } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { apiKeysTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

function getSessionId(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  return (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip) || "anonymous";
}

router.post("/api-keys", async (req, res) => {
  const parsed = CreateApiKeyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { label } = parsed.data;
  const sessionId = getSessionId(req);
  const id = randomUUID();
  const key = `lb_${randomUUID().replace(/-/g, "")}`;
  await db.insert(apiKeysTable).values({ id, key, label, sessionId });
  const [created] = await db.select().from(apiKeysTable).where(eq(apiKeysTable.id, id));
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

router.get("/api-keys", async (req, res) => {
  const sessionId = getSessionId(req);
  const keys = await db.select().from(apiKeysTable).where(eq(apiKeysTable.sessionId, sessionId));
  res.json(keys.map((k) => ({ ...k, createdAt: k.createdAt.toISOString() })));
});

router.delete("/api-keys/:id", async (req, res) => {
  const parsed = DeleteApiKeyParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const sessionId = getSessionId(req);
  await db.delete(apiKeysTable).where(and(eq(apiKeysTable.id, parsed.data.id), eq(apiKeysTable.sessionId, sessionId)));
  res.json({ status: "deleted" });
});

export default router;
