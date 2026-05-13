import { useState } from "react";
import { ShieldCheck, UserPlus, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { toast } = useToast();

  // Protect the route visually
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive font-semibold text-xl">Access Denied. Administrators only.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/lawyer", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create advocate account");

      toast({ title: "Advocate Created", description: `${name} can now log in using the Lawyer Portal.` });
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const e = error as Error;
      toast({ title: "Creation Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Admin Control Panel</h1>
            <p className="text-muted-foreground">Add new verified advocates to the platform.</p>
          </div>

          <div className="glass-card rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" /> Register Advocate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Advocate Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" type="text" required placeholder="Adv. John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" required placeholder="advocate@legaledge.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" required placeholder="••••••••" className="pl-10" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <Button type="submit" variant="default" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Advocate Account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;