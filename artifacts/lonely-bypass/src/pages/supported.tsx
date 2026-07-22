import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { useGetSupportedServices, getGetSupportedServicesQueryKey } from "@workspace/api-client-react";

const CATEGORY_ORDER = ["Key System", "Link Shortener"];

export default function Supported() {
  const [search, setSearch] = useState("");
  const { data: services = [], isLoading } = useGetSupportedServices({ query: { queryKey: getGetSupportedServicesQueryKey() } });

  const filtered = services.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.domains?.some((d: string) => d.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = filtered.filter((s: any) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof services>);

  const otherCats = filtered.filter((s: any) => !CATEGORY_ORDER.includes(s.category));
  if (otherCats.length > 0) grouped["Other"] = otherCats;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400 mb-6">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {services.length} supported services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Supported Services</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Every service we can bypass, with notes on reliability. We're always adding more.</p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            placeholder="Search services or domains..."
            className="w-full h-12 pl-11 pr-4 bg-[#13141a] border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-[#13141a] border border-white/8 animate-pulse" />
            ))}
          </div>
        ) : Object.entries(grouped).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p>No services found for "{search}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{category}</h2>
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-xs text-muted-foreground/60">{(items as any[]).length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {(items as any[]).map((service: any, i: number) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#13141a] border border-white/8 hover:border-emerald-500/20 hover:bg-[#14161e] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-emerald-300 transition-colors">{service.name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {service.domains?.map((d: string) => (
                            <span key={d} className="text-xs text-muted-foreground/70 font-mono bg-white/5 px-2 py-0.5 rounded-md">{d}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {service.notes ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            {service.notes.length > 20 ? service.notes.slice(0, 20) + "…" : service.notes}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Working
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 text-center">
          <h3 className="font-semibold text-white mb-2">Missing a service?</h3>
          <p className="text-sm text-muted-foreground mb-4">Join our Discord and request it. We add new bypasses regularly.</p>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all">
            <ExternalLink className="w-4 h-4" />
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}
