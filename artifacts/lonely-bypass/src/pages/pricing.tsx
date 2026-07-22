import { motion } from "framer-motion";
import { Check, Code, Server, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <section className="w-full pt-20 pb-12 px-4 flex flex-col items-center text-center relative">
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            API access for <span className="text-primary">builders.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            The web interface is 100% free. If you want to integrate Lonely Bypass into your own applications, choose an API plan below.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Pay as you go */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-card border-white/5 shadow-xl relative overflow-hidden">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold">Pay-as-you-go</CardTitle>
                <CardDescription className="text-base mt-2">Perfect for side projects and small bots.</CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">$1</span>
                  <span className="text-muted-foreground font-medium">/ 1000 requests</span>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4">
                  {[
                    "Access to all 50+ bypassers",
                    "Bulk bypass endpoint",
                    "Standard rate limits (5 req/sec)",
                    "Community Discord support",
                    "Never expires"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-white/5">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Monthly */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 border-primary/30 shadow-2xl shadow-primary/5 relative overflow-hidden">
              {/* Highlight badge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
                Most Popular
              </div>

              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl font-bold">Monthly Unlimited</CardTitle>
                <CardDescription className="text-base mt-2">For heavy users and commercial apps.</CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">$8</span>
                  <span className="text-muted-foreground font-medium">/ 30 days</span>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4">
                  {[
                    "Unlimited bypass requests",
                    "Access to all 50+ bypassers",
                    "Priority routing & higher limits (20 req/sec)",
                    "Direct developer support",
                    "Early access to new bypassers"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

        </div>
      </section>

      {/* Payment methods */}
      <section className="w-full border-t border-white/5 bg-secondary/10 py-16 mt-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-xl font-semibold mb-8">We accept crypto & fiat</h3>
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              <span className="font-medium">Cards / Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6" />
              <span className="font-medium">Litecoin</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-6 h-6" />
              <span className="font-medium">Bitcoin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Solana</span>
            </div>
          </div>
          
          <div className="mt-12 p-6 rounded-xl border border-white/5 bg-background flex flex-col sm:flex-row items-center justify-between text-left gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-1">Looking for documentation?</h4>
              <p className="text-muted-foreground text-sm">Read the docs to see how to integrate the API.</p>
            </div>
            <Button variant="outline" className="shrink-0 bg-secondary/50 border-white/10">
              Read Docs <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}