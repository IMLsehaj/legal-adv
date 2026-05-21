import { useState, useEffect, useRef } from "react";
import { Star, MapPin, Briefcase, Clock, MessageSquare, Calendar, Search, Video, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const specializations = ["All", "Criminal", "Civil", "Property", "Business", "Family", "Tax"];

type Lawyer = { id: string; name: string; specialization: string; location: string; experience: number; rating: number; reviews: number; fee: number; available: boolean; bio: string; };

type LawyerFromAPI = {
  _id: string;
  name: string;
  lawyerDetails?: {
    specialization?: string;
    experience?: number;
    hourlyRate?: number;
    bio?: string;
    location?: string;
  };
};

type ChatMessage = { _id: string; sender: string; receiver: string; content: string; createdAt: string };

const ExpertConnect = () => {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState("All");
  const { toast } = useToast();
  const { user, token } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat state
  const [chatLawyer, setChatLawyer] = useState<Lawyer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/lawyers");
        if (!res.ok) throw new Error("Failed to fetch lawyers");

        const data = await res.json();
        const formatted = data.map((user: LawyerFromAPI) => ({
          id: user._id,
          name: user.name,
          specialization: user.lawyerDetails?.specialization || "General",
          location: user.lawyerDetails?.location || "Not specified",
          experience: user.lawyerDetails?.experience || 0,
          rating: 5.0, // Placeholder
          reviews: 0,
          fee: user.lawyerDetails?.hourlyRate || 0,
          available: true,
          bio: user.lawyerDetails?.bio || "No biography available.",
        }));
        setLawyers(formatted);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
        toast({ title: "Error", description: "Failed to load experts. Please try again later.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, [toast]);

  const filtered = lawyers.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = activeSpec === "All" || l.specialization === activeSpec;
    return matchesSearch && matchesSpec;
  });

  const handleBook = async (lawyerId: string, lawyerName: string) => {
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
          lawyerId: lawyerId,
          date: new Date().toISOString(), // Placeholder date until lawyer sets it
          notes: `Consultation requested. Waiting for lawyer's schedule.`
        })
      });

      if (!response.ok) throw new Error("Failed to book appointment.");

      toast({ title: "Consultation Requested!", description: `Your request with ${lawyerName} has been sent to our backend.` });
    } catch (error) {
      const e = error as Error;
      toast({ title: "Booking Failed", description: e.message, variant: "destructive" });
    }
  };

  const openChat = async (lawyer: Lawyer) => {
    if (!token) {
      toast({ title: "Authentication Required", description: "Please sign in to message a lawyer.", variant: "destructive" });
      return;
    }
    setChatLawyer(lawyer);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${lawyer.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(await res.json());
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatLawyer || !token) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: chatLawyer.id, content: newMessage }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages([...messages, msg]);
        setNewMessage("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (e) {
      console.error(e);
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

          {/* Chat Modal */}
          {chatLawyer && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="glass-card rounded-xl w-full max-w-md shadow-2xl border border-border flex flex-col h-[500px]">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-lg">
                      {chatLawyer.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <h3 className="font-serif text-foreground leading-none">{chatLawyer.name}</h3>
                      <span className="text-xs text-muted-foreground">{chatLawyer.specialization} Expert</span>
                    </div>
                  </div>
                  <button onClick={() => setChatLawyer(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm mt-10">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === user?._id;
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t bg-muted/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                      value={newMessage} 
                      onChange={(e) => setNewMessage(e.target.value)} 
                      placeholder="Type a message..." 
                      className="flex-1 rounded-full bg-background border-border"
                    />
                    <Button type="submit" size="icon" className="rounded-full shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

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
            {loading ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading legal experts...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No lawyers found matching your criteria.</p>
              </div>
            ) : filtered.map((lawyer, i) => (
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
                      <Button size="sm" disabled={!lawyer.available} onClick={() => handleBook(lawyer.id, lawyer.name)}>
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book
                      </Button>
                      <Button size="sm" variant="outline" disabled={!lawyer.available}>
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Video Call
                      </Button>
                      <Button size="sm" variant="ghost" disabled={!lawyer.available} onClick={() => openChat(lawyer)}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertConnect;
