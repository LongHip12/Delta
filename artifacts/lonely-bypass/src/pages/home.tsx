import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, ExternalLink, ArrowRight, X, Share2, Link as LinkIcon, Key, Zap, AlertCircle } from "lucide-react";
import { useGetStats, getGetStatsQueryKey, useGetSupportedServices, getGetSupportedServicesQueryKey, useListApiKeys, getListApiKeysQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

type BypassResult = {
  success: boolean;
  key?: string;
  destination?: string;
  error?: string;
};

type BypassState = "idle" | "running" | "done";

function SkeletonResultCard() {
  return (
    <div className="mt-6 rounded-2xl border border-white/8 bg-[#15161d] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10" />
          <div>
            <div className="h-4 w-32 bg-white/10 rounded mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        </div>
        <div className="h-8 w-16 bg-white/10 rounded-lg" />
      </div>
      <div className="h-12 w-full bg-white/8 rounded-xl mb-4" />
      <div className="flex gap-3">
        <div className="h-11 flex-1 bg-emerald-500/20 rounded-xl" />
        <div className="h-11 flex-1 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}

function ResultCard({ result, elapsedMs, originalUrl, onClose }: { result: BypassResult; elapsedMs: number; originalUrl: string; onClose: () => void }) {
  const { toast } = useToast();
  const displayUrl = result.key || result.destination || "";

  const copy = (text: string, label = "Copied!") => {
    navigator.clipboard.writeText(text).then(() => toast({ title: label }));
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ url: displayUrl }).catch(() => {});
    } else {
      copy(displayUrl, "Link copied!");
    }
  };

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Bypass failed</p>
              <p className="text-xs text-muted-foreground mt-0.5">{elapsedMs} ms</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            Close
          </button>
        </div>
        <p className="mt-4 text-sm text-red-300">{result.error || "Unknown error"}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-6 rounded-2xl border border-white/8 bg-[#15161d] p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Bypass complete</p>
            <p className="text-xs text-muted-foreground mt-0.5">Close anytime · {elapsedMs} ms</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
        >
          Close
        </button>
      </div>

      <div className="bg-[#0e0f14] border border-white/8 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm text-foreground font-mono break-all leading-relaxed">{displayUrl}</p>
      </div>

      <div className="flex gap-3 mb-3">
        <a
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Open Link
        </a>
        <button
          onClick={() => copy(displayUrl)}
          className="flex-1 h-11 flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 text-white font-semibold text-sm rounded-xl transition-all border border-white/8"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={share}
          className="h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/8 transition-colors"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => copy(originalUrl, "Original URL copied!")}
          className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Copy original URL
        </button>
      </div>
    </motion.div>
  );
}

function ElapsedTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startTime), 50);
    return () => clearInterval(id);
  }, [startTime]);
  return <span className="tabular-nums">{elapsed < 1000 ? `${elapsed} ms` : `${(elapsed / 1000).toFixed(1)} s`}</span>;
}

export default function Home() {
  const [tab, setTab] = useState<"single" | "bulk" | "api">("single");
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [bypassState, setBypassState] = useState<BypassState>("idle");
  const [result, setResult] = useState<BypassResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [bulkResults, setBulkResults] = useState<Array<{ url: string; success: boolean; key?: string; destination?: string; error?: string }>>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: services = [] } = useGetSupportedServices({ query: { queryKey: getGetSupportedServicesQueryKey() } });
  const { data: apiKeys = [] } = useListApiKeys({ query: { queryKey: getListApiKeysQueryKey() } });

  const popularServices = services.slice(0, 6);

  const handleSingleBypass = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setBypassState("running");
    setResult(null);
    setLogs([]);
    const t0 = Date.now();
    setStartTime(t0);

    try {
      const resp = await fetch(`${BASE_URL}/api/bypass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), lootResult: undefined }),
        signal: abortRef.current.signal,
      });

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const msg = JSON.parse(line.slice(6));
            if (msg.type === "log") {
              setLogs(prev => [...prev.slice(-20), msg.msg]);
            } else if (msg.type === "result") {
              const elapsed = Date.now() - t0;
              setElapsedMs(elapsed);
              setResult({ success: msg.success, key: msg.key, destination: msg.destination, error: msg.error });
              setBypassState("done");
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setResult({ success: false, error: "Network error: " + err.message });
        setElapsedMs(Date.now() - t0);
        setBypassState("done");
      } else {
        setBypassState("idle");
      }
    }
  }, [url]);

  const handleBulkBypass = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urls.trim()) return;
    if (!apiKey.trim()) {
      toast({ variant: "destructive", title: "API Key Required", description: "Bulk bypass requires an API key. Get one in the API tab." });
      setTab("api");
      return;
    }

    const urlList = urls.split("\n").map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    setBulkLoading(true);
    setBulkResults([]);

    try {
      const resp = await fetch(`${BASE_URL}/api/bypass/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlList, apiKey }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ variant: "destructive", title: "Error", description: data.error || "Bulk bypass failed" });
      } else {
        setBulkResults(data.results || []);
      }
    } catch {
      toast({ variant: "destructive", title: "Network error", description: "Failed to reach server" });
    } finally {
      setBulkLoading(false);
    }
  }, [urls, apiKey, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast({ title: "Copied!" }));
  };

  const TABS = [
    { id: "single", label: "Single Link" },
    { id: "bulk", label: "Bulk Bypass" },
    { id: "api", label: "+ API Key" },
  ] as const;

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-400/5 blur-[100px] rounded-full" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="z-10 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free · Fast · No surveys · {services.length || 7} services
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-5 leading-tight">
            Lonely{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Bypass.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            The fastest, cleanest link bypasser on the web. Skip Platoboost, Lootlabs, Linkvertise and more — instantly.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-2xl z-10">
          <div className="bg-[#13141a] border border-white/8 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex border-b border-white/8">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-3.5 text-sm font-medium transition-all relative ${tab === t.id ? "text-white" : "text-muted-foreground hover:text-white/70"}`}
                >
                  {tab === t.id && (
                    <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-white/5" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                  <span className="relative z-10">{t.label}</span>
                  {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />}
                </button>
              ))}
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {tab === "single" && (
                  <motion.div key="single" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <form onSubmit={handleSingleBypass} className="flex gap-3">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          placeholder="Paste your link (e.g. loot.link/...)"
                          className="w-full h-12 pl-10 pr-4 bg-[#0e0f14] border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                          value={url}
                          onChange={e => setUrl(e.target.value)}
                          disabled={bypassState === "running"}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={bypassState === "running" || !url.trim()}
                        className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
                      >
                        {bypassState === "running" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <ElapsedTimer startTime={startTime} />
                          </>
                        ) : (
                          <>Bypass <Zap className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>

                    <AnimatePresence mode="wait">
                      {bypassState === "running" && (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <SkeletonResultCard />
                          {logs.length > 0 && (
                            <p className="mt-2 text-xs text-muted-foreground/60 font-mono truncate">
                              {logs[logs.length - 1]}
                            </p>
                          )}
                        </motion.div>
                      )}
                      {bypassState === "done" && result && (
                        <ResultCard
                          key="result"
                          result={result}
                          elapsedMs={elapsedMs}
                          originalUrl={url}
                          onClose={() => { setBypassState("idle"); setResult(null); }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {tab === "bulk" && (
                  <motion.div key="bulk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {!apiKey && (
                      <div className="mb-4 flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <p className="text-sm text-amber-200/80">
                          Bulk bypass requires an API key.{" "}
                          <button onClick={() => setTab("api")} className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2">
                            Get one here
                          </button>
                        </p>
                      </div>
                    )}
                    <form onSubmit={handleBulkBypass} className="flex flex-col gap-3">
                      <textarea
                        placeholder="Paste multiple links, one per line..."
                        className="w-full min-h-[140px] p-4 bg-[#0e0f14] border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-y font-mono"
                        value={urls}
                        onChange={e => setUrls(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={bulkLoading || !urls.trim()}
                        className="h-12 w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {bulkLoading ? (
                          <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                        ) : (
                          <><Zap className="w-4 h-4" /> Bypass All Links</>
                        )}
                      </button>
                    </form>

                    {bulkResults.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2 max-h-72 overflow-y-auto">
                        {bulkResults.map((r, i) => (
                          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${r.success ? "bg-emerald-500/5 border-emerald-500/15" : "bg-red-500/5 border-red-500/15"}`}>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.success ? "bg-emerald-400" : "bg-red-400"}`} />
                            <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{r.url}</span>
                            {r.success && (r.key || r.destination) && (
                              <button onClick={() => copyToClipboard(r.key || r.destination || "")} className="text-emerald-400 hover:text-emerald-300 flex-shrink-0">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!r.success && <span className="text-red-400 text-xs flex-shrink-0">Failed</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === "api" && (
                  <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="mb-4 p-4 rounded-xl bg-[#0e0f14] border border-white/8">
                      <p className="text-sm text-muted-foreground mb-3">Enter your API key to enable bulk bypass and higher rate limits.</p>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                          type="password"
                          placeholder="lb_..."
                          className="w-full h-11 pl-10 pr-4 bg-[#13141a] border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                          value={apiKey}
                          onChange={e => setApiKey(e.target.value)}
                        />
                      </div>
                      {apiKey && (
                        <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> API key set — bulk bypass enabled
                        </p>
                      )}
                    </div>

                    <div className="border-t border-white/8 pt-4">
                      <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Your API Keys</p>
                      {apiKeys.length === 0 ? (
                        <p className="text-sm text-muted-foreground/60">No API keys yet. Visit <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300">Pricing</Link> to get one.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {apiKeys.map((k: any) => (
                            <div key={k.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0e0f14] border border-white/8">
                              <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{k.label || "Unnamed"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{k.key?.slice(0, 12)}...</p>
                              </div>
                              <button onClick={() => copyToClipboard(k.key)} className="text-muted-foreground hover:text-white transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-10 flex flex-col items-center z-10">
          <p className="text-xs text-muted-foreground/60 mb-4 uppercase tracking-widest font-medium">Supported Services</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularServices.map((s: any) => (
              <span key={s.id} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 text-sm text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all cursor-default">
                {s.name}
              </span>
            ))}
            {services.length === 0 && (
              <>
                {["Platoboost (Delta)", "Lootlabs", "Loot.link", "Work.ink", "Boost.ink", "Linkvertise"].map(n => (
                  <span key={n} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 text-sm text-muted-foreground">{n}</span>
                ))}
              </>
            )}
            <Link href="/supported" className="px-3.5 py-1.5 rounded-full text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 hover:bg-emerald-500/8 transition-all group">
              View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="w-full py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/2 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {[
              { value: stats ? stats.totalBypassed.toLocaleString() : "1.2M+", label: "Total Bypassed", color: "text-foreground" },
              { value: stats ? String(stats.totalServices) : "7+", label: "Supported Services", color: "text-emerald-400" },
              { value: stats?.uptime ?? "99.9%", label: "Uptime", color: "text-foreground" },
            ].map(({ value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center py-10 px-6 text-center"
              >
                <div className={`text-5xl md:text-6xl font-bold mb-3 ${color}`}>{value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Lonely Bypass?</h2>
            <p className="text-muted-foreground">Built different. Built faster.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "⚡", title: "Instant Bypass", desc: "Most links resolved in under 2 seconds with our optimized engine." },
              { icon: "🔑", title: "Real Key Extraction", desc: "Actually extracts Delta/Platoboost keys, not just redirect links." },
              { icon: "🤖", title: "Auto Captcha Solver", desc: "Built-in GIF captcha analysis solves Platoboost challenges automatically." },
              { icon: "📦", title: "Bulk API", desc: "Bypass up to 50 links in one request with your API key." },
              { icon: "🆓", title: "Free Tier", desc: "Single link bypass is completely free, no account needed." },
              { icon: "🔒", title: "No Data Stored", desc: "We don't log or store your URLs. In, out, done." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-[#13141a] border border-white/8 hover:border-emerald-500/20 hover:bg-[#14161e] transition-all group">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-emerald-300 transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
