import { Link } from "react-router-dom";
import { FileCheck, FileText, BarChart3, Shield, Users, Zap, ArrowRight, CheckCircle2, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import heroImage from "@/assets/hero-legal.jpg";

const features = [
  { icon: FileCheck, title: "Smart Document Checker", desc: "Upload any legal document and get instant analysis for missing fields, format issues, and terminology errors." },
  { icon: Zap, title: "AI Legal Suggestions", desc: "Get AI-powered recommendations for proper legal formatting, required sections, and improved language." },
  { icon: BarChart3, title: "Rejection Prediction", desc: "See success probability scores and risk factors before you submit, based on structure and completeness." },
  { icon: FileText, title: "Templates Library", desc: "Pre-built legal templates for FIR complaints, rent agreements, affidavits, and more." },
  { icon: Users, title: "Expert Connect", desc: "Connect with verified lawyers for consultation and get professional guidance on your documents." },
  { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade encryption. Your documents are never shared or used for training." },
];

const stats = [
  { value: "50K+", label: "Documents Analyzed" },
  { value: "92%", label: "Approval Rate" },
  { value: "200+", label: "Templates" },
  { value: "4.9★", label: "User Rating" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Property Lawyer, Delhi", text: "LegalEdge cut my document review time by 70%. The AI catches issues I'd sometimes miss after hours of manual review.", rating: 5 },
  { name: "Rahul Mehta", role: "Small Business Owner", text: "I used to pay ₹5,000 per contract review. Now I get instant analysis and templates that are perfectly formatted.", rating: 5 },
  { name: "Adv. Sneha Patil", role: "Criminal Law, Mumbai", text: "The FIR complaint template alone has saved my clients countless rejections. Highly recommend for legal professionals.", rating: 5 },
  { name: "Vikram Joshi", role: "Startup Founder", text: "Generated NDAs and employment contracts in minutes. The rejection prediction feature gave us confidence before filing.", rating: 4 },
  { name: "Dr. Anita Desai", role: "University Professor", text: "I recommend LegalEdge to all my law students. It's the best way to learn proper legal document formatting.", rating: 5 },
  { name: "Manoj Kumar", role: "Real Estate Agent", text: "Rent agreements, sale deeds — everything is handled perfectly. My clients love the professional quality.", rating: 5 },
];

const faqs = [
  { q: "Is my document data secure?", a: "Absolutely. We use AES-256 encryption and your documents are never stored permanently or used for AI training. All data is processed in isolated environments." },
  { q: "What document formats are supported?", a: "We support PDF, DOC, DOCX, TXT, and RTF files up to 20MB. Scanned documents are processed with OCR technology." },
  { q: "How accurate is the rejection prediction?", a: "Our model has been trained on 100K+ legal documents and achieves 92% accuracy in predicting document acceptance rates." },
  { q: "Can I use this for court filings?", a: "Yes, our templates follow the latest legal formatting standards. However, we recommend having a lawyer review critical filings." },
  { q: "Is there a free plan?", a: "Yes! You get 5 free document analyses per month and access to basic templates. Premium plans unlock unlimited analysis and expert consultations." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
      </div>
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4 text-accent" />
            AI-Powered Legal Document Platform
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6"
          >
            Legal Documents,{" "}
            <span className="text-gradient">Perfected</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Check, correct, and create legal documents with AI. Reduce rejections by 90% with smart analysis and pre-built templates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button size="lg" asChild className="group">
              <Link to="/checker">
                Check a Document
                <motion.span className="ml-2 inline-block" whileHover={{ x: 4 }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/templates">Browse Templates</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 border-y bg-card">
      <motion.div
        className="container grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {stats.map((s) => (
          <motion.div key={s.label} className="text-center" variants={item}>
            <div className="font-serif text-3xl md:text-4xl text-foreground mb-1">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* Features */}
    <section className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A complete legal document toolkit powered by AI to save you time and reduce errors.</p>
        </AnimatedSection>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl p-6 group cursor-default"
            >
              <motion.div
                className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center mb-4 group-hover:bg-accent/25 transition-colors"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
              >
                <f.icon className="w-6 h-6 text-accent" />
              </motion.div>
              <h3 className="font-serif text-xl text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 bg-card border-y">
      <div className="container">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">How It Works</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: "01", title: "Upload Document", desc: "Upload your legal document in PDF or text format." },
            { step: "02", title: "AI Analysis", desc: "Our AI checks for errors, missing fields, and formatting issues." },
            { step: "03", title: "Get Results", desc: "Receive corrections, risk scores, and improvement suggestions." },
          ].map((s, i) => (
            <AnimatedSection key={s.step} delay={i * 0.15} className="text-center">
              <motion.div
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-serif text-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {s.step}
              </motion.div>
              <h3 className="font-serif text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Trusted by Thousands</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">See what legal professionals and individuals say about LegalEdge.</p>
        </AnimatedSection>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-6 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className={`w-3.5 h-3.5 ${si < t.rating ? "text-accent fill-accent" : "text-border"}`} />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-20 bg-card border-y">
      <div className="container max-w-3xl">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Frequently Asked Questions</h2>
        </AnimatedSection>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.q} delay={i * 0.08}>
              <details className="glass-card rounded-xl group">
                <summary className="p-5 cursor-pointer text-foreground font-medium text-sm flex items-center justify-between list-none">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-open:rotate-90 shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              </details>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection>
          <motion.div
            className="max-w-3xl mx-auto text-center glass-card rounded-2xl p-10 md:p-14 relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 relative z-10">Ready to Perfect Your Documents?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto relative z-10">Join thousands of users who trust LegalEdge for accurate, compliant legal documents.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <Button size="lg" asChild>
                <Link to="/checker">Start Free Analysis <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground relative z-10">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> No credit card</span>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
