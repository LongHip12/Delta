import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SERVICES = [
  { id: "linkvertise", name: "Linkvertise", domains: ["linkvertise.com"], category: "Advertising" },
  { id: "lootlabs", name: "Lootlabs", domains: ["lootlabs.gg"], category: "Advertising" },
  { id: "work-ink", name: "Work.ink", domains: ["work.ink"], category: "Advertising" },
  { id: "platoboost", name: "Platoboost", domains: ["platoboost.com", "platoboost.app"], category: "Key System" },
  { id: "pandadevelopment", name: "PandaDevelopment", domains: ["pandadevelopment.net", "ads.pandauth.com", "new.pandadevelopment.net"], category: "Key System" },
  { id: "trigonevo", name: "Trigon Evo", domains: ["trigonevo.com"], category: "Key System" },
  { id: "violated", name: "Violated", domains: ["violated.lol"], category: "Key System" },
  { id: "blox-script", name: "Blox Script", domains: ["blox-script.com", "boblox-script.com"], category: "Key System" },
  { id: "hydrogen", name: "Hydrogen", domains: ["hydrogen.lat"], category: "Key System" },
  { id: "codex", name: "Codex", domains: ["key.codex.lol"], category: "Key System" },
  { id: "rekonise", name: "Rekonise", domains: ["rekonise.com"], category: "Advertising" },
  { id: "sub2unlock", name: "Sub2Unlock", domains: ["sub2unlock.com"], category: "Advertising" },
  { id: "fluxus", name: "Fluxus", domains: ["flux.li"], category: "Key System" },
  { id: "delta", name: "Delta", domains: ["getdelta.app"], category: "Key System" },
];

router.get("/supported", (_req, res) => {
  res.json(SERVICES);
});

export default router;
