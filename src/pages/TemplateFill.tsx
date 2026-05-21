import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useResults } from "@/contexts/ResultsContext";
import { useAuth } from "@/contexts/AuthContext";

type FieldConfig = { name: string; label: string; type: "text" | "textarea" | "date"; placeholder: string; required: boolean };

const templateData: Record<string, { title: string; category: string; description: string; fields: FieldConfig[] }> = {
  "fir-complaint": {
    title: "FIR Complaint",
    category: "Criminal",
    description: "First Information Report template for filing criminal complaints at a police station. Fill in your details below and generate a properly formatted FIR.",
    fields: [
      { name: "complainant_name", label: "Complainant Full Name", type: "text", placeholder: "Enter your full name", required: true },
      { name: "father_name", label: "Father's / Husband's Name", type: "text", placeholder: "Enter name", required: true },
      { name: "address", label: "Address", type: "textarea", placeholder: "Full residential address", required: true },
      { name: "phone", label: "Phone Number", type: "text", placeholder: "+91 XXXXX XXXXX", required: true },
      { name: "incident_date", label: "Date of Incident", type: "date", placeholder: "", required: true },
      { name: "incident_place", label: "Place of Incident", type: "text", placeholder: "Location where incident occurred", required: true },
      { name: "incident_details", label: "Details of Incident", type: "textarea", placeholder: "Describe what happened in detail...", required: true },
      { name: "accused_details", label: "Accused Details (if known)", type: "textarea", placeholder: "Name, description, or any identifying details", required: false },
      { name: "witnesses", label: "Witness Names (if any)", type: "textarea", placeholder: "Names and addresses of witnesses", required: false },
    ],
  },
  "rent-agreement": {
    title: "Rent Agreement",
    category: "Property",
    description: "Standard rental agreement with all legally required clauses. Fill in the details to generate a complete, formatted agreement.",
    fields: [
      { name: "landlord_name", label: "Landlord Full Name", type: "text", placeholder: "Property owner's full name", required: true },
      { name: "tenant_name", label: "Tenant Full Name", type: "text", placeholder: "Tenant's full name", required: true },
      { name: "property_address", label: "Property Address", type: "textarea", placeholder: "Complete address of rental property", required: true },
      { name: "monthly_rent", label: "Monthly Rent (₹)", type: "text", placeholder: "e.g., 15,000", required: true },
      { name: "security_deposit", label: "Security Deposit (₹)", type: "text", placeholder: "e.g., 30,000", required: true },
      { name: "start_date", label: "Lease Start Date", type: "date", placeholder: "", required: true },
      { name: "duration", label: "Lease Duration (months)", type: "text", placeholder: "e.g., 11", required: true },
      { name: "special_terms", label: "Special Terms & Conditions", type: "textarea", placeholder: "Any additional clauses...", required: false },
    ],
  },
  "affidavit": {
    title: "Affidavit",
    category: "Personal",
    description: "General affidavit template for sworn statements. Customize with your specific declaration details.",
    fields: [
      { name: "deponent_name", label: "Deponent Full Name", type: "text", placeholder: "Person making the affidavit", required: true },
      { name: "father_name", label: "Father's Name", type: "text", placeholder: "Father's full name", required: true },
      { name: "age", label: "Age", type: "text", placeholder: "e.g., 35", required: true },
      { name: "address", label: "Residential Address", type: "textarea", placeholder: "Complete address", required: true },
      { name: "purpose", label: "Purpose of Affidavit", type: "text", placeholder: "e.g., Name change, Address proof", required: true },
      { name: "declaration", label: "Declaration Statement", type: "textarea", placeholder: "I solemnly declare that...", required: true },
      { name: "place", label: "Place of Signing", type: "text", placeholder: "City name", required: true },
      { name: "date", label: "Date", type: "date", placeholder: "", required: true },
    ],
  },
  "nda": {
    title: "Non-Disclosure Agreement",
    category: "Business",
    description: "Protect confidential information shared between parties. Fill in party details and scope of confidentiality.",
    fields: [
      { name: "party_a_name", label: "Disclosing Party Name", type: "text", placeholder: "Company or individual name", required: true },
      { name: "party_a_address", label: "Disclosing Party Address", type: "textarea", placeholder: "Full address", required: true },
      { name: "party_b_name", label: "Receiving Party Name", type: "text", placeholder: "Company or individual name", required: true },
      { name: "party_b_address", label: "Receiving Party Address", type: "textarea", placeholder: "Full address", required: true },
      { name: "effective_date", label: "Effective Date", type: "date", placeholder: "", required: true },
      { name: "duration_years", label: "Duration (years)", type: "text", placeholder: "e.g., 2", required: true },
      { name: "scope", label: "Scope of Confidential Information", type: "textarea", placeholder: "Describe what information is covered...", required: true },
      { name: "jurisdiction", label: "Governing Jurisdiction", type: "text", placeholder: "e.g., Mumbai, Maharashtra", required: true },
    ],
  },
  "power-of-attorney": {
    title: "Power of Attorney",
    category: "Personal",
    description: "Grant legal authority to someone to act on your behalf in specified matters.",
    fields: [
      { name: "principal_name", label: "Principal (Grantor) Name", type: "text", placeholder: "Person granting authority", required: true },
      { name: "principal_address", label: "Principal Address", type: "textarea", placeholder: "Complete address", required: true },
      { name: "agent_name", label: "Agent (Attorney) Name", type: "text", placeholder: "Person receiving authority", required: true },
      { name: "agent_address", label: "Agent Address", type: "textarea", placeholder: "Complete address", required: true },
      { name: "powers", label: "Powers Granted", type: "textarea", placeholder: "List specific powers being granted...", required: true },
      { name: "effective_date", label: "Effective Date", type: "date", placeholder: "", required: true },
      { name: "expiry_date", label: "Expiry Date (if any)", type: "date", placeholder: "", required: false },
    ],
  },
  "legal-notice": {
    title: "Legal Notice",
    category: "Civil",
    description: "Formal legal notice for disputes, claims, or breach of contract.",
    fields: [
      { name: "sender_name", label: "Sender (Your) Name", type: "text", placeholder: "Your full name", required: true },
      { name: "sender_address", label: "Sender Address", type: "textarea", placeholder: "Your complete address", required: true },
      { name: "recipient_name", label: "Recipient Name", type: "text", placeholder: "Person/entity receiving notice", required: true },
      { name: "recipient_address", label: "Recipient Address", type: "textarea", placeholder: "Recipient's complete address", required: true },
      { name: "subject", label: "Subject of Notice", type: "text", placeholder: "e.g., Breach of Contract", required: true },
      { name: "facts", label: "Statement of Facts", type: "textarea", placeholder: "Describe the facts of the matter...", required: true },
      { name: "demand", label: "Demand / Relief Sought", type: "textarea", placeholder: "What action do you demand?", required: true },
      { name: "deadline_days", label: "Response Deadline (days)", type: "text", placeholder: "e.g., 15", required: true },
    ],
  },
  "bail-application": {
    title: "Bail Application",
    category: "Criminal",
    description: "Application for bail with proper formatting and all required legal sections.",
    fields: [
      { name: "court_name", label: "Name of the Court", type: "text", placeholder: "e.g., Sessions Court, Delhi", required: true },
      { name: "applicant_name", label: "Applicant Name", type: "text", placeholder: "Full name of the accused", required: true },
      { name: "fir_number", label: "FIR Number", type: "text", placeholder: "e.g., 123/2023", required: true },
      { name: "police_station", label: "Police Station", type: "text", placeholder: "Where FIR was registered", required: true },
      { name: "offences", label: "Offences/Sections", type: "text", placeholder: "e.g., u/s 302, 320 IPC", required: true },
      { name: "grounds", label: "Grounds for Bail", type: "textarea", placeholder: "Reasons why bail should be granted...", required: true },
    ]
  },
  "sale-deed": {
    title: "Sale Deed",
    category: "Property",
    description: "Property sale deed template with all mandatory clauses and witness sections.",
    fields: [
      { name: "vendor_name", label: "Vendor (Seller) Name", type: "text", placeholder: "Seller's full name", required: true },
      { name: "purchaser_name", label: "Purchaser (Buyer) Name", type: "text", placeholder: "Buyer's full name", required: true },
      { name: "property_schedule", label: "Schedule of Property", type: "textarea", placeholder: "Complete description of the property", required: true },
      { name: "sale_consideration", label: "Sale Consideration (₹)", type: "text", placeholder: "Total sale amount", required: true },
      { name: "date_of_execution", label: "Date of Execution", type: "date", placeholder: "", required: true },
    ]
  },
  "employment-contract": {
    title: "Employment Contract",
    category: "Business",
    description: "Comprehensive employment agreement covering terms, compensation, and termination.",
    fields: [
      { name: "employer_name", label: "Employer Name", type: "text", placeholder: "Company name", required: true },
      { name: "employee_name", label: "Employee Name", type: "text", placeholder: "Employee's full name", required: true },
      { name: "job_title", label: "Job Title", type: "text", placeholder: "e.g., Software Engineer", required: true },
      { name: "joining_date", label: "Date of Joining", type: "date", placeholder: "", required: true },
      { name: "compensation", label: "Annual Compensation (₹)", type: "text", placeholder: "e.g., 12,00,000", required: true },
      { name: "probation_period", label: "Probation Period (months)", type: "text", placeholder: "e.g., 3", required: true },
      { name: "notice_period", label: "Notice Period (days)", type: "text", placeholder: "e.g., 30", required: true },
    ]
  },
  "divorce-petition": {
    title: "Divorce Petition",
    category: "Civil",
    description: "Petition for dissolution of marriage with grounds and prayer sections.",
    fields: [
      { name: "petitioner_name", label: "Petitioner Name", type: "text", placeholder: "Your full name", required: true },
      { name: "respondent_name", label: "Respondent Name", type: "text", placeholder: "Spouse's full name", required: true },
      { name: "marriage_date", label: "Date of Marriage", type: "date", placeholder: "", required: true },
      { name: "place_of_marriage", label: "Place of Marriage", type: "text", placeholder: "City/Town", required: true },
      { name: "grounds", label: "Grounds for Divorce", type: "textarea", placeholder: "Describe the reasons/grounds...", required: true },
    ]
  },
  "will-testament": {
    title: "Will / Testament",
    category: "Personal",
    description: "Last will and testament with proper witness and executor designation sections.",
    fields: [
      { name: "testator_name", label: "Testator Name", type: "text", placeholder: "Your full name", required: true },
      { name: "age", label: "Age", type: "text", placeholder: "Your age", required: true },
      { name: "address", label: "Address", type: "textarea", placeholder: "Your complete address", required: true },
      { name: "executor_name", label: "Executor Name", type: "text", placeholder: "Name of the executor", required: true },
      { name: "beneficiaries", label: "Beneficiaries & Assets", type: "textarea", placeholder: "Describe who gets what...", required: true },
      { name: "date", label: "Date of Will", type: "date", placeholder: "", required: true },
    ]
  },
  "partnership-deed": {
    title: "Partnership Deed",
    category: "Business",
    description: "Partnership agreement defining roles, profit sharing, and dissolution terms.",
    fields: [
      { name: "firm_name", label: "Partnership Firm Name", type: "text", placeholder: "Name of the business", required: true },
      { name: "principal_place", label: "Principal Place of Business", type: "textarea", placeholder: "Business address", required: true },
      { name: "nature_of_business", label: "Nature of Business", type: "textarea", placeholder: "Describe the business activities", required: true },
      { name: "partner_one", label: "First Partner Name", type: "text", placeholder: "Full name", required: true },
      { name: "partner_two", label: "Second Partner Name", type: "text", placeholder: "Full name", required: true },
      { name: "profit_ratio", label: "Profit Sharing Ratio", type: "text", placeholder: "e.g., 50:50", required: true },
      { name: "start_date", label: "Date of Commencement", type: "date", placeholder: "", required: true },
    ]
  }
};

const TemplateFill = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDocument } = useResults();
  const { token } = useAuth();
  const template = slug ? templateData[slug] : null;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Template Not Found</h1>
          <Button asChild><Link to="/templates">Back to Templates</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Authentication Required", description: "Please log in to generate documents.", variant: "destructive" });
      return;
    }

    const missingRequired = template.fields.filter((f) => f.required && !formData[f.name]?.trim());
    if (missingRequired.length > 0) {
      toast({ title: "Missing Fields", description: `Please fill: ${missingRequired.map(f => f.label).join(", ")}`, variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/api/ai/generate-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateTitle: template.title, formData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Generation failed");

      setGeneratedHtml(data.html);

      addDocument({
        id: Date.now(),
        name: `${template.title.replace(/\s+/g, "_")}.pdf`,
        status: "approved",
        score: 100,
        date: new Date().toLocaleDateString(),
        type: template.category,
      });
      toast({ title: "Document Generated!", description: "Your AI-drafted document is ready for review." });
    } catch (error) {
      toast({ title: "Generation Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedHtml) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${template?.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; color: #000; }
              h1, h2, h3 { text-align: center; }
              p { margin-bottom: 15px; }
            </style>
          </head>
          <body>
            ${generatedHtml}
            <script>
              window.onload = () => { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/templates")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Templates
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-foreground">{template.title}</h1>
              <span className="text-xs text-muted-foreground">{template.category}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-8">{template.description}</p>

          {!generatedHtml ? (
            <form onSubmit={handleGenerate} className="glass-card rounded-xl p-6 md:p-8 space-y-5">
              {template.fields.map((field) => (
                <div key={field.name}>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? "Drafting Document..." : "Generate Document"} <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-up">
              <div className="glass-card rounded-xl p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                <h2 className="font-serif text-2xl text-foreground mb-2">Document Ready!</h2>
                <p className="text-muted-foreground text-sm mb-6">Your {template.title} has been generated with all provided details and proper legal formatting.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={handleDownloadPDF}><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                  <Button size="lg" variant="outline" onClick={() => { setGeneratedHtml(null); }}>Edit Details</Button>
                </div>
              </div>

              {/* Preview */}
              <div className="glass-card rounded-xl p-6 md:p-8">
                <h3 className="font-serif text-lg text-foreground mb-4">Document Preview</h3>
                <div 
                  className="bg-background border border-border rounded-lg p-8 prose dark:prose-invert max-w-none text-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TemplateFill;
