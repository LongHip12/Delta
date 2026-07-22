import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Clock, Code2, Lock } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Lightning Fast",
      description: "Our distributed bypass nodes process your requests in milliseconds, getting you to your destination instantly without artificial delays."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Reliable & Stable",
      description: "With 99.9% guaranteed uptime and redundant bypassing infrastructure, Lonely Bypass works consistently when you need it most."
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: "50+ Services Supported",
      description: "From Linkvertise to Work.ink, we support bypassing for over 50 of the most annoying link shorteners and ad networks."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "No Waiting, No Surveys",
      description: "Skip the countdown timers, CAPTCHAs, and intrusive ad surveys completely. Go directly from A to B."
    },
    {
      icon: <Code2 className="w-6 h-6 text-primary" />,
      title: "Developer API",
      description: "Integrate our bypassing engine directly into your own apps, discord bots, or browser extensions with our clean REST API."
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Privacy First",
      description: "We don't log the destinations you bypass or track your IP address. Your data is yours, and we keep it that way."
    }
  ];

  return (
    <div className="w-full flex flex-col">
      <section className="w-full pt-20 pb-16 px-4 flex flex-col items-center text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5 text-sm font-medium text-muted-foreground mb-6">
            The Superior Choice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Why choose <span className="text-primary">Lonely Bypass?</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We built Lonely Bypass because we were tired of broken adblockers, slow proxy sites, and unreliable bypassers. Here's why we're better.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}