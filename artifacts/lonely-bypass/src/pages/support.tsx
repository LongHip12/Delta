import { motion } from "framer-motion";
import { MessageSquare, Mail, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Support() {
  const faqs = [
    {
      question: "What is Lonely Bypass?",
      answer: "Lonely Bypass is a service that helps you skip ad-link shorteners (like Linkvertise, Work.ink, etc.) and go directly to your destination URL without having to watch ads, do surveys, or wait for timers."
    },
    {
      question: "Is the web interface free?",
      answer: "Yes, the web interface is completely free to use for individual links and bulk bypassing. We only charge for API access if you want to integrate our engine into your own apps."
    },
    {
      question: "A link didn't work. What do I do?",
      answer: "Link shorteners constantly update their systems to block bypassers. If a link fails, it might be a new protection method. Please report it in our Discord server so we can update our bypassing logic."
    },
    {
      question: "How do I get an API key?",
      answer: "You can purchase an API key on the Pricing page. Once purchased, you can generate your key in the dashboard and use it in your requests."
    },
    {
      question: "Do you log my bypassed links?",
      answer: "No. We maintain basic statistical counters (like 'Total Links Bypassed') for the homepage, but we do not store the URLs you submit or the destinations you visit."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <section className="w-full pt-20 pb-12 px-4 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Need some <span className="text-primary">help?</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you have a question about the API, need to report a broken link, or just want to say hi, we're here for you.
          </p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center text-center hover:border-primary/20 transition-colors"
          >
            <MessageSquare className="w-10 h-10 text-[#5865F2] mb-4" />
            <h3 className="text-xl font-bold mb-2">Discord Community</h3>
            <p className="text-muted-foreground mb-6">
              Join our active community to get the fastest support, report bugs, and chat with other users.
            </p>
            <Button className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white font-medium">
              Join Discord Server
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center text-center hover:border-primary/20 transition-colors"
          >
            <Mail className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-6">
              For business inquiries, API custom plans, or private matters, send us a direct email.
            </p>
            <Button variant="outline" className="w-full bg-secondary/50 border-white/10 hover:bg-secondary">
              support@lonelybypass.com
            </Button>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/5">
                  <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </section>
    </div>
  );
}