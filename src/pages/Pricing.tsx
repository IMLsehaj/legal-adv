import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Get started with basic document analysis.",
    features: ["5 document analyses/month", "Basic templates", "Format checking", "Email support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    desc: "For individuals who need regular legal document support.",
    features: ["Unlimited analyses", "All templates", "AI suggestions", "Rejection prediction", "Priority support", "Document history"],
    cta: "Get Professional",
    popular: true,
  },
  {
    name: "Business",
    price: "₹4,999",
    period: "/month",
    desc: "For law firms and businesses with team access.",
    features: ["Everything in Professional", "5 team members", "Expert consultations (3/mo)", "Custom templates", "API access", "Dedicated account manager"],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="text-center mb-14">
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-xl p-6 md:p-8 flex flex-col relative ${
                plan.popular
                  ? "glass-card border-2 border-accent shadow-xl scale-[1.02]"
                  : "glass-card"
              }`}
              style={{ animation: "fade-up 0.5s ease-out forwards", animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-serif text-xl text-foreground mb-2">{plan.name}</h3>
              <div className="mb-1">
                <span className="font-serif text-4xl text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant={plan.popular ? "default" : "outline"} className="w-full">
                {plan.cta} {plan.popular && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ-like */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            All plans include AES-256 encryption, GDPR compliance, and 99.9% uptime SLA.
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Need a custom plan? <Link to="/experts" className="text-accent hover:underline">Contact our team</Link>.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Pricing;
