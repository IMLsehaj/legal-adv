import { Link } from "react-router-dom";
import { FileText, Search, Download, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const categories = ["All", "Criminal", "Civil", "Property", "Business", "Personal"];

const templates = [
  { id: 1, slug: "fir-complaint", title: "FIR Complaint", category: "Criminal", desc: "First Information Report template for filing criminal complaints at police station.", downloads: 12400, popular: true },
  { id: 2, slug: "rent-agreement", title: "Rent Agreement", category: "Property", desc: "Standard rental agreement with all legally required clauses and terms.", downloads: 18200, popular: true },
  { id: 3, slug: "affidavit", title: "Affidavit", category: "Personal", desc: "General affidavit template for sworn statements with proper legal formatting.", downloads: 9800, popular: false },
  { id: 4, slug: "power-of-attorney", title: "Power of Attorney", category: "Personal", desc: "Grant legal authority to someone to act on your behalf in specified matters.", downloads: 7600, popular: true },
  { id: 5, slug: "nda", title: "Non-Disclosure Agreement", category: "Business", desc: "Protect confidential information shared between parties during business dealings.", downloads: 15100, popular: true },
  { id: 6, slug: "bail-application", title: "Bail Application", category: "Criminal", desc: "Application for bail with proper formatting and all required legal sections.", downloads: 5400, popular: false },
  { id: 7, slug: "sale-deed", title: "Sale Deed", category: "Property", desc: "Property sale deed template with all mandatory clauses and witness sections.", downloads: 11300, popular: false },
  { id: 8, slug: "employment-contract", title: "Employment Contract", category: "Business", desc: "Comprehensive employment agreement covering terms, compensation, and termination.", downloads: 8900, popular: false },
  { id: 9, slug: "legal-notice", title: "Legal Notice", category: "Civil", desc: "Formal legal notice template for disputes, claims, or breach of contract.", downloads: 13700, popular: true },
  { id: 10, slug: "divorce-petition", title: "Divorce Petition", category: "Civil", desc: "Petition for dissolution of marriage with grounds and prayer sections.", downloads: 6200, popular: false },
  { id: 11, slug: "will-testament", title: "Will / Testament", category: "Personal", desc: "Last will and testament with proper witness and executor designation sections.", downloads: 4800, popular: false },
  { id: 12, slug: "partnership-deed", title: "Partnership Deed", category: "Business", desc: "Partnership agreement defining roles, profit sharing, and dissolution terms.", downloads: 7100, popular: false },
];

const Templates = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Templates Library</h1>
            <p className="text-muted-foreground">
              Pre-built legal document templates. Just fill in your details — AI auto-corrects formatting and language.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className="glass-card rounded-xl p-5 hover:shadow-xl transition-all duration-300 group flex flex-col"
                style={{ animation: "fade-up 0.5s ease-out forwards", animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  {t.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                </div>
                <h3 className="font-serif text-lg text-foreground mb-1">{t.title}</h3>
                <Badge variant="outline" className="w-fit mb-3 text-xs">{t.category}</Badge>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t.downloads.toLocaleString()} uses</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild><Link to={`/templates/${t.slug}`}><Eye className="w-4 h-4" /></Link></Button>
                    <Button size="sm" asChild><Link to={`/templates/${t.slug}`}><Download className="w-4 h-4 mr-1.5" /> Use</Link></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No templates found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Templates;
