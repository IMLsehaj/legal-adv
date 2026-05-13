import { useState } from "react";
import { Star, MapPin, Briefcase, Clock, MessageSquare, Calendar, Search, Filter, Video, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const specializations = ["All", "Criminal", "Civil", "Property", "Business", "Family", "Tax"];

const lawyers = [
  { id: 1, name: "Adv. Rajesh Kumar", specialization: "Criminal", location: "Delhi", experience: 15, rating: 4.9, reviews: 234, fee: 2000, available: true, bio: "Senior criminal lawyer with expertise in cybercrime, fraud, and white-collar cases. Former public prosecutor." },
  { id: 2, name: "Adv. Meera Iyer", specialization: "Property", location: "Mumbai", experience: 12, rating: 4.8, reviews: 189, fee: 2500, available: true, bio: "Property law specialist handling real estate disputes, land acquisition, and RERA compliance matters." },
  { id: 3, name: "Adv. Sanjay Gupta", specialization: "Business", location: "Bangalore", experience: 18, rating: 4.7, reviews: 312, fee: 3000, available: false, bio: "Corporate lawyer specializing in mergers, acquisitions, startup law, and intellectual property." },
  { id: 4, name: "Adv. Priya Nair", specialization: "Family", location: "Chennai", experience: 10, rating: 4.9, reviews: 156, fee: 1500, available: true, bio: "Family law expert handling divorce, custody, maintenance, and domestic violence cases with empathy." },
  { id: 5, name: "Adv. Amit Sharma", specialization: "Civil", location: "Delhi", experience: 20, rating: 4.6, reviews: 278, fee: 2500, available: true, bio: "Experienced civil litigator with expertise in contract disputes, consumer rights, and recovery suits." },
  { id: 6, name: "Adv. Fatima Khan", specialization: "Tax", location: "Hyderabad", experience: 14, rating: 4.8, reviews: 198, fee: 3500, available: true, bio: "Tax law specialist covering income tax, GST, customs, and international taxation matters." },
  { id: 7, name: "Adv. Vikram Singh", specialization: "Criminal", location: "Jaipur", experience: 8, rating: 4.5, reviews: 102, fee: 1500, available: true, bio: "Young dynamic criminal lawyer specializing in bail matters, drug cases, and juvenile justice." },
  { id: 8, name: "Adv. Ananya Desai", specialization: "Business", location: "Pune", experience: 11, rating: 4.7, reviews: 167, fee: 2000, available: false, bio: "Startup and SME legal advisor covering compliance, contracts, and employment law." },
];

const ExpertConnect = () => {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState("All");
  const [selectedLawyer, setSelectedLawyer] = useState<number | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const filtered = lawyers.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = activeSpec === "All" || l.specialization === activeSpec;
    return matchesSearch && matchesSpec;
  });

  const handleBook = async (lawyerName: string) => {
    if (!token) {
      toast({ title: "Authentication Required", description: "Please sign in to book a consultation.", variant: "destructive" });
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lawyerId: "60d5ecb8b392d700153bf000", // Using a dummy MongoDB ObjectId for testing since lawyers are currently hardcoded
          date: new Date(Date.now() + 86400000).toISOString(),
          notes: `Consultation request for ${lawyerName}`
        })
      });

      if (!response.ok) throw new Error("Failed to book appointment.");

      toast({ title: "Consultation Requested!", description: `Your request with ${lawyerName} has been sent to our backend.` });
      setSelectedLawyer(null);
    } catch (error) {
      const e = error as Error;
      toast({ title: "Booking Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Expert Connect</h1>
            <p className="text-muted-foreground">Connect with verified lawyers for professional consultation. Get guidance on your legal documents and cases.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {specializations.map((s) => (
                <button key={s} onClick={() => setActiveSpec(s)} className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSpec === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Lawyers grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((lawyer, i) => (
              <div key={lawyer.id} className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300" style={{ animation: "fade-up 0.5s ease-out forwards", animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-xl shrink-0">
                    {lawyer.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg text-foreground truncate">{lawyer.name}</h3>
                      {lawyer.available ? (
                        <Badge className="bg-success/15 text-success border-success/30 text-xs shrink-0">Available</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs shrink-0">Busy</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {lawyer.specialization}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lawyer.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lawyer.experience} yrs</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{lawyer.bio}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-sm font-semibold text-foreground">{lawyer.rating}</span>
                        <span className="text-xs text-muted-foreground">({lawyer.reviews})</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₹{lawyer.fee.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/session</span></span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={!lawyer.available} onClick={() => handleBook(lawyer.name)}>
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book
                      </Button>
                      <Button size="sm" variant="outline" disabled={!lawyer.available}>
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Video Call
                      </Button>
                      <Button size="sm" variant="ghost" disabled={!lawyer.available}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No lawyers found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertConnect;
