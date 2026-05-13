import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";

const getNavLinks = (role?: string) => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/templates", label: "Templates" },
    { to: "/checker", label: "Document Checker" },
    { to: "/experts", label: "Experts" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/pricing", label: "Pricing" },
  ];
  if (role === "admin") {
    links.splice(4, 0, { to: "/admin/dashboard", label: "Add New Lawyer" });
  }
  return links;
};

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const currentNavLinks = getNavLinks(user?.role);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl text-foreground">LegalEdge</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {currentNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <>
              <span className="text-sm font-medium text-foreground mr-2">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>Log out</Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Sign In</Link></Button>
              <Button size="sm" asChild><Link to="/register">Get Started</Link></Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {currentNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-md text-sm font-medium ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            {user ? (
              <Button variant="outline" size="sm" className="w-full" onClick={logout}>Log out</Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button variant="ghost" size="sm" className="flex-1" asChild><Link to="/login">Sign In</Link></Button>
                <Button size="sm" className="flex-1" asChild><Link to="/register">Get Started</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
