import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Link as LinkIcon, Database, Activity } from "lucide-react";
import { useGetSupportedServices, getGetSupportedServicesQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SupportedServices() {
  const [search, setSearch] = useState("");
  const { data: services = [], isLoading } = useGetSupportedServices({ query: { queryKey: getGetSupportedServicesQueryKey() } });

  const filteredServices = useMemo(() => {
    if (!search) return services;
    const lowerSearch = search.toLowerCase();
    return services.filter(
      s => s.name.toLowerCase().includes(lowerSearch) || 
           s.domains.some(d => d.toLowerCase().includes(lowerSearch)) ||
           s.category.toLowerCase().includes(lowerSearch)
    );
  }, [services, search]);

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return Array.from(cats);
  }, [services]);

  const totalDomains = useMemo(() => {
    return services.reduce((acc, curr) => acc + curr.domains.length, 0);
  }, [services]);

  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof services> = {};
    filteredServices.forEach(service => {
      if (!groups[service.category]) groups[service.category] = [];
      groups[service.category].push(service);
    });
    return groups;
  }, [filteredServices]);

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <section className="w-full py-16 px-4 flex flex-col items-center text-center relative overflow-hidden bg-secondary/5">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-3xl w-full"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Every service we <span className="text-primary">bypass.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our catalog of supported platforms, shorteners, and services. 
            We're constantly adding new ones.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name, domain, or category..." 
              className="pl-12 h-14 bg-card/80 backdrop-blur-md border-white/10 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="w-full border-y border-white/5 bg-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{categories.length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase">Categories</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{services.length || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase">Services</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{totalDomains || 0}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase">Domains</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="container mx-auto px-4 py-16 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p>Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No services found</h3>
            <p className="text-muted-foreground">We couldn't find anything matching "{search}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {Object.entries(groupedServices).map(([category, catServices], index) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <div className="h-px bg-white/5 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catServices.map(service => (
                    <Card key={service.id} className="bg-card border-white/5 hover:border-primary/20 transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="font-semibold text-lg">{service.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {service.domains.map(domain => (
                            <Badge key={domain} variant="secondary" className="bg-secondary/50 text-xs font-normal border-white/5 text-muted-foreground">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}