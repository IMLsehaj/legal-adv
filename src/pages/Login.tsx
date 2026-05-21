import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

const Login = () => {
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to login");

      if (data.role !== 'client') {
        throw new Error("Please use the dedicated Lawyer or Admin portal to sign in.");
      }

      login(data.token, data);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      
      navigate("/dashboard");
    } catch (error) {
      const e = error as Error;
      toast({ title: "Login Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your LegalEdge account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" required placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">Don't have an account? <Link to="/register" className="text-accent hover:underline">Sign up</Link></p>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/lawyer-login" className="hover:text-foreground hover:underline">Lawyer Portal</Link>
            <span>•</span>
            <Link to="/admin-login" className="hover:text-foreground hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;