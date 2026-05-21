import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-24 pb-16 p-4">
        <div className="text-center max-w-md w-full glass-card p-10 rounded-2xl animate-scale-in">
          <h1 className="mb-4 text-6xl font-serif text-foreground">404</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Oops! The page you are looking for doesn't exist.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
