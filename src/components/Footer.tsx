import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <Link to="/" className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Scale className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg text-foreground">LegalEdge</span>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AI-powered legal document analysis and compliance platform.
        </p>
      </div>
      {[
        { title: "Product", links: ["Document Checker", "Templates", "AI Engine", "Pricing"] },
        { title: "Resources", links: ["Documentation", "Blog", "Support", "API"] },
        { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-semibold text-foreground text-sm mb-3">{col.title}</h4>
          <ul className="space-y-2">
            {col.links.map((link) => (
              <li key={link}>
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  {link}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t">
      <div className="container py-6 text-center text-xs text-muted-foreground">
        © 2026 LegalEdge. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
