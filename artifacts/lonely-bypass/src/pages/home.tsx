import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Zap, Key, Link as LinkIcon, CheckCircle2, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { useBypassLink, useBypassBulk, useGetStats, getGetStatsQueryKey, useGetSupportedServices, getGetSupportedServicesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [bypassResult, setBypassResult] = useState<any>(null);
  const [bulkBypassResult, setBulkBypassResult] = useState<any[]>([]);
  const { toast } = useToast();

  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: services = [] } = useGetSupportedServices({ query: { queryKey: getGetSupportedServicesQueryKey() } });

  const bypassLink = useBypassLink();
  const bypassBulk = useBypassBulk();

  const handleBypassSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    bypassLink.mutate(
      { data: { url, apiKey: apiKey || undefined } },
      {
        onSuccess: (data) => {
          setBypassResult(data);
          if (data.success) {
            toast({ title: "Success", description: "Link bypassed successfully!" });
          } else {
            toast({ variant: "destructive", title: "Error", description: "Failed to bypass link" });
          }
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "An error occurred while bypassing" });
        }
      }
    );
  };

  const handleBypassBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urls) return;

    const urlList = urls.split("\n").map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    bypassBulk.mutate(
      { data: { urls: urlList, apiKey: apiKey || undefined } },
      {
        onSuccess: (data) => {
          setBulkBypassResult(data.results);
          toast({ title: "Success", description: `Processed ${data.results.length} links` });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "An error occurred while bypassing bulk links" });
        }
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Success", description: "Copied to clipboard" });
  };

  // Get popular services (first 4)
  const popularServices = services.slice(0, 4);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-sm font-medium text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            50+ services · free · no surveys
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Lonely <span className="text-primary">Bypass.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            The fastest, cleanest, and most reliable link bypasser on the web. 
            Skip annoying shorteners instantly.
          </p>
        </motion.div>

        {/* Bypass Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-3xl z-10"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-white/5 shadow-2xl">
            <CardContent className="p-6">
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1">
                  <TabsTrigger value="single">Single Link</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Bypass</TabsTrigger>
                  <TabsTrigger value="api">+ API Key</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single">
                  <form onSubmit={handleBypassSingle} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Paste your link here (e.g., linkvertise.com/...)" 
                        className="pl-10 h-14 bg-secondary/30 border-white/10 text-lg focus-visible:ring-primary"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                      disabled={bypassLink.isPending || !url}
                    >
                      {bypassLink.isPending ? "Bypassing..." : "Bypass"}
                      <Zap className="ml-2 w-5 h-5" />
                    </Button>
                  </form>

                  {/* Single Result */}
                  {bypassResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6"
                    >
                      <div className={`p-4 rounded-xl border ${bypassResult.success ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                        <div className="flex items-center gap-3 overflow-hidden w-full">
                          {bypassResult.success ? (
                            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                          ) : (
                            <Shield className="w-6 h-6 text-destructive flex-shrink-0" />
                          )}
                          <div className="overflow-hidden w-full">
                            <p className="text-sm text-muted-foreground mb-1">
                              {bypassResult.success ? `Bypassed ${bypassResult.service || 'link'} successfully` : 'Error bypassing link'}
                            </p>
                            <p className="font-medium truncate text-foreground">
                              {bypassResult.destination || bypassResult.error || "Unknown error"}
                            </p>
                          </div>
                        </div>
                        {bypassResult.success && bypassResult.destination && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(bypassResult.destination!)} className="bg-background/50 border-white/10 hover:bg-background">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                              <a href={bypassResult.destination} target="_blank" rel="noopener noreferrer">
                                Open
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </TabsContent>
                
                <TabsContent value="bulk">
                  <form onSubmit={handleBypassBulk} className="flex flex-col gap-4">
                    <Textarea 
                      placeholder="Paste multiple links here (one per line)..." 
                      className="min-h-[150px] bg-secondary/30 border-white/10 text-base focus-visible:ring-primary resize-y"
                      value={urls}
                      onChange={(e) => setUrls(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      className="h-14 w-full text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={bypassBulk.isPending || !urls}
                    >
                      {bypassBulk.isPending ? "Processing..." : "Bypass All Links"}
                      <Zap className="ml-2 w-5 h-5" />
                    </Button>
                  </form>

                  {/* Bulk Results */}
                  {bulkBypassResult.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                      {bulkBypassResult.map((res, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${res.success ? 'bg-primary/5 border-primary/10' : 'bg-destructive/5 border-destructive/10'} flex items-center justify-between gap-4`}>
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs text-muted-foreground truncate mb-1">Link {i + 1}</p>
                            <p className="text-sm font-medium truncate text-foreground">
                              {res.destination || res.error || "Unknown error"}
                            </p>
                          </div>
                          {res.success && res.destination && (
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(res.destination!)} className="h-8 w-8 hover:bg-primary/20 hover:text-primary">
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </TabsContent>
                
                <TabsContent value="api">
                  <div className="flex flex-col gap-4">
                    <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 mb-2">
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter your API key below. Once set, it will be used for all bypass requests in this session to access premium features.
                      </p>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          type="password"
                          placeholder="lb_..." 
                          className="pl-10 bg-secondary/30 border-white/10"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Services row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center"
        >
          <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">POPULAR SERVICES</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {popularServices.map(service => (
              <span key={service.id} className="px-4 py-2 rounded-lg bg-secondary/30 border border-white/5 text-sm font-medium hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-default">
                {service.name}
              </span>
            ))}
            {services.length === 0 && (
              <>
                <span className="px-4 py-2 rounded-lg bg-secondary/30 border border-white/5 text-sm font-medium">Linkvertise</span>
                <span className="px-4 py-2 rounded-lg bg-secondary/30 border border-white/5 text-sm font-medium">Lootlabs</span>
                <span className="px-4 py-2 rounded-lg bg-secondary/30 border border-white/5 text-sm font-medium">Work.ink</span>
                <span className="px-4 py-2 rounded-lg bg-secondary/30 border border-white/5 text-sm font-medium">Platoboost</span>
              </>
            )}
            <Link href="/supported" className="px-4 py-2 rounded-lg text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 group">
              See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-secondary/10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                {stats ? stats.totalBypassed.toLocaleString() : "1.2M+"}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Bypassed</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center p-6"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                {stats ? stats.totalServices : "50+"}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Supported Services</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center p-6"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                {stats ? stats.uptime : "99.9%"}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}