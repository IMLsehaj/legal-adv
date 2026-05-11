import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const LawyerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to login");

      if (data.role !== 'lawyer') {
        throw new Error("Unauthorized access. This portal is for lawyers only.");
      }

      login(data.token, data);
      toast({ title: "Welcome back!", description: "You have successfully logged in to the Lawyer Portal." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-scale-in border border-accent/30">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent mx-auto flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-2">Lawyer Portal</h1>
            <p className="text-muted-foreground text-sm">Sign in to manage your appointments and clients</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="lawyer@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" required placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In as Lawyer"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">Are you a client? <Link to="/login" className="text-primary hover:underline">Client Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LawyerLogin;