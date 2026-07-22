import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SERVICES = [
  { id: "platorelay", name: "Platoboost (Delta)", domains: ["auth.platorelay.com"], category: "Key System", notes: "Delta executor key system" },
  { id: "gateway-platoboost", name: "Gateway Platoboost", domains: ["gateway.platoboost.com"], category: "Key System", notes: "Platoboost gateway" },
  { id: "lootlabs", name: "Lootlabs", domains: ["lootlabs.gg"], category: "Link Shortener", notes: "" },
  { id: "lootlink", name: "Loot.link", domains: ["loot.link"], category: "Link Shortener", notes: "" },
  { id: "workink", name: "Work.ink", domains: ["work.ink"], category: "Link Shortener", notes: "" },
  { id: "boostink", name: "Boost.ink", domains: ["boost.ink"], category: "Link Shortener", notes: "" },
  { id: "linkvertise", name: "Linkvertise", domains: ["linkvertise.com"], category: "Link Shortener", notes: "Cloudflare protected, may fail" },
];

router.get("/supported", (_req, res) => {
  res.json(SERVICES);
});

export default router;
