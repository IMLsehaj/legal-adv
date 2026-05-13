import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock, User as UserIcon, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleKey, setRoleKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, roleKey }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to register");

      login(data.token, data);
      toast({ title: "Account created!", description: "Welcome to LegalEdge." });
      
      if (data.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const e = error as Error;
      toast({ title: "Registration Failed", description: e.message, variant: "destructive" });
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
            <h1 className="font-serif text-3xl text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">Join LegalEdge to manage your documents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" type="text" required placeholder="John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
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
                <Input id="password" type="password" required placeholder="••••••••" className="pl-10" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roleKey">Admin Key (Optional)</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="roleKey" type="password" placeholder="Leave empty for client" className="pl-10" value={roleKey} onChange={(e) => setRoleKey(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Register;