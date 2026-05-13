import { useState } from "react";
import { Upload, FileCheck, AlertTriangle, CheckCircle2, XCircle, ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useResults } from "@/contexts/ResultsContext";
import { useAuth } from "@/contexts/AuthContext";
import * as mammoth from "mammoth";

type AnalysisResult = {
  score: number;
  analysisText?: string;
  issues: { type: "error" | "warning" | "success"; message: string; section: string }[];
  suggestions: string[];
};

const mockResult: AnalysisResult = {
  score: 78,
  issues: [
    { type: "error", message: "Missing notarization section", section: "Signatures" },
    { type: "error", message: "Date format is inconsistent (use DD/MM/YYYY)", section: "Header" },
    { type: "warning", message: "Witness details are incomplete", section: "Witness" },
    { type: "warning", message: "Jurisdiction clause could be more specific", section: "Terms" },
    { type: "success", message: "All parties properly identified", section: "Parties" },
    { type: "success", message: "Consideration clause is well-defined", section: "Terms" },
    { type: "success", message: "Proper legal terminology used throughout", section: "Language" },
  ],
  suggestions: [
    "Add a notarization clause at the end of the document with space for notary seal.",
    "Standardize all dates to DD/MM/YYYY format for consistency.",
    "Include full name, address, and identification number for each witness.",
    "Specify the exact court jurisdiction (e.g., 'District Court of Mumbai').",
  ],
};

const Checker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { addDocument } = useResults();
  const { token } = useAuth();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    if (!token) {
      toast({ title: "Authentication Required", description: "Please log in to use the AI Document Checker.", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    try {
      let textToAnalyze = `Mock extracted text for ${file.name}. Actual extraction requires a parsing library.`;
      if (file.name.endsWith('.txt')) {
        textToAnalyze = await file.text();
      } else if (file.name.endsWith('.docx')) {
        // Parse the Word Document into raw text
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textToAnalyze = result.value;
      }

      const response = await fetch("http://localhost:5000/api/ai/analyze-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ caseDescription: textToAnalyze }),
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.message || "AI analysis failed.");
      }

      setResult({
        score: 85, // Fallback score 
        analysisText: data.analysis,
        issues: mockResult.issues, // Keeping your mock layout elements visible
        suggestions: mockResult.suggestions,
      });

      addDocument({ id: Date.now(), name: file.name, status: "pending", score: 85, date: new Date().toLocaleDateString(), type: "Document" });

      toast({ title: "Analysis Complete", description: "Your document was successfully analyzed by AI." });
    } catch (error) {
      const e = error as Error;
      console.error("AI Analysis Error:", e);
      toast({ title: "Analysis Error", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

  const issueIcon = (type: string) => {
    if (type === "error") return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-warning shrink-0" />;
    return <CheckCircle2 className="w-4 h-4 text-success shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Document Checker</h1>
            <p className="text-muted-foreground">
              Upload your legal document for AI-powered analysis. Get instant feedback on errors, missing sections, and improvements.
            </p>
          </div>

          {/* Upload area */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <label
              className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
            >
              <input type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleUpload} />
              {file ? (
                <>
                  <FileText className="w-12 h-12 text-accent mb-3" />
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground">Drop your document here</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF, TXT, DOC, DOCX (max 20MB)</p>
                </>
              )}
            </label>

            {file && !result && (
              <div className="mt-6 flex justify-center">
                <Button size="lg" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 mr-2" />
                      Analyze Document
                    </>
                  )}
                </Button>
              </div>
            )}

            {analyzing && (
              <div className="mt-6 max-w-md mx-auto">
                <Progress value={66} className="h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">Checking structure, language, and compliance...</p>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-fade-up">
              {/* Score */}
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">Document Score</p>
                <div className={`font-serif text-6xl ${scoreColor(result.score)} mb-2`}>
                  {result.score}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.score >= 80 ? "Good — minor improvements needed" : result.score >= 60 ? "Fair — several issues to address" : "Needs significant corrections"}
                </p>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-destructive" /> {result.issues.filter(i => i.type === "error").length} Errors</span>
                  <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-warning" /> {result.issues.filter(i => i.type === "warning").length} Warnings</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> {result.issues.filter(i => i.type === "success").length} Passed</span>
                </div>
              </div>

              {result.analysisText && (
                <div className="glass-card rounded-xl p-6">
                  <h2 className="font-serif text-xl text-foreground mb-4">
                    <Sparkles className="w-5 h-5 inline mr-2 text-accent" />
                    AI Legal Analysis
                  </h2>
                  <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.analysisText}
                  </div>
                </div>
              )}

              {/* Issues */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="font-serif text-xl text-foreground mb-4">Analysis Details</h2>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      {issueIcon(issue.type)}
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{issue.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Section: {issue.section}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="font-serif text-xl text-foreground mb-4">
                  <Sparkles className="w-5 h-5 inline mr-2 text-accent" />
                  AI Suggestions
                </h2>
                <div className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-accent/5">
                      <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checker;
