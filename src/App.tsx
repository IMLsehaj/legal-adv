import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ResultsProvider } from "@/contexts/ResultsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Templates from "./pages/Templates.tsx";
import TemplateFill from "./pages/TemplateFill.tsx";
import Checker from "./pages/Checker.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ExpertConnect from "./pages/ExpertConnect.tsx";
import Pricing from "./pages/Pricing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import LawyerLogin from "./pages/LawyerLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
    <ResultsProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:slug" element={<TemplateFill />} />
          <Route path="/checker" element={<Checker />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/experts" element={<ExpertConnect />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/lawyer-login" element={<LawyerLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ResultsProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
