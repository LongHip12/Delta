import { bypassPlatoboost } from "./platoboost.js";
import { bypassGatewayPlatoboost } from "./gateway-platoboost.js";
import { bypassLootLink, bypassWorkInk, bypassBoostInk, bypassLinkvertise, bypassLootLabs } from "./lootlink.js";

function detectUrlType(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.toLowerCase();
    if (h.includes("platorelay.com")) return "platorelay";
    if (h.includes("platoboost.com")) return "gateway";
    if (h.includes("loot.link")) return "lootlink";
    if (h.includes("lootlabs.gg")) return "lootlabs";
    if (h.includes("work.ink")) return "workink";
    if (h.includes("boost.ink")) return "boostink";
    if (h.includes("linkvertise.com")) return "linkvertise";
  } catch {}
  return "unknown";
}

export async function runBypass(url, onLog, lootResult) {
  const type = detectUrlType(url.trim());
  onLog(`Platform: ${type}`);

  if (type === "platorelay") {
    return bypassPlatoboost(url.trim(), onLog, lootResult);
  } else if (type === "gateway") {
    return bypassGatewayPlatoboost(url.trim(), onLog);
  } else if (type === "lootlabs") {
    const destUrl = await bypassLootLabs(url.trim(), onLog);
    if (!destUrl) return { success: false, error: "Cannot bypass LootLabs" };
    onLog(`→ platorelay URL: ${destUrl.slice(0, 80)}`);
    return bypassPlatoboost(destUrl, onLog);
  } else if (type === "lootlink") {
    const destUrl = await bypassLootLink(url.trim(), onLog);
    if (!destUrl) return { success: false, error: "Cannot bypass loot.link" };
    onLog(`→ platorelay URL: ${destUrl.slice(0, 80)}`);
    return bypassPlatoboost(destUrl, onLog);
  } else if (type === "workink") {
    const destUrl = await bypassWorkInk(url.trim(), onLog);
    if (!destUrl) return { success: false, error: "Cannot bypass work.ink" };
    return bypassPlatoboost(destUrl, onLog);
  } else if (type === "boostink") {
    const destUrl = await bypassBoostInk(url.trim(), onLog);
    if (!destUrl) return { success: false, error: "Cannot bypass boost.ink" };
    return bypassPlatoboost(destUrl, onLog);
  } else if (type === "linkvertise") {
    const destUrl = await bypassLinkvertise(url.trim(), onLog);
    if (!destUrl) return { success: false, error: "Cannot bypass Linkvertise (Cloudflare protected)" };
    return bypassPlatoboost(destUrl, onLog);
  } else {
    return {
      success: false,
      error: "Unsupported URL. Supported: auth.platorelay.com, gateway.platoboost.com, loot.link, lootlabs.gg, work.ink, boost.ink, linkvertise.com",
    };
  }
}
