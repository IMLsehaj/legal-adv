import { FileText, Clock, CheckCircle2, AlertTriangle, XCircle, TrendingUp, BarChart3, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useResults, DocStatus } from "@/contexts/ResultsContext";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType }> = {
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  corrections: { label: "Needs Corrections", variant: "destructive", icon: AlertTriangle },
  pending: { label: "Pending", variant: "secondary", icon: Clock },
};

const Dashboard = () => {
  const { documents, activity, addDocument } = useResults();
  const { user } = useAuth();

  const total = documents.length;
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const correctionsCount = documents.filter((d) => d.status === 'corrections').length;
  const avgScore = Math.round(
    (documents.reduce((acc, d) => acc + (d.score || 0), 0) / Math.max(1, documents.filter((d) => d.score !== null).length)) || 0
  );

  const stats = [
    { icon: FileText, label: 'Total Documents', value: String(total), color: 'text-accent' },
    { icon: CheckCircle2, label: 'Approved', value: String(approvedCount), color: 'text-success' },
    { icon: AlertTriangle, label: 'Need Corrections', value: String(correctionsCount), color: 'text-warning' },
    { icon: TrendingUp, label: 'Avg Score', value: `${avgScore}%`, color: 'text-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Dashboard</h1>
            <p className="text-muted-foreground">Track your submitted documents, scores, and corrections.</p>
            {user?.role === 'admin' && (
              <div className="mt-4 mb-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-2xl">
                <h3 className="text-destructive font-semibold mb-1">Administrator Account</h3>
                <p className="text-sm text-muted-foreground mb-3">You are currently viewing the client dashboard. Go to the Admin Panel to register advocates.</p>
                <Button asChild variant="destructive" size="sm">
                  <Link to="/admin/dashboard">Go to Admin Panel</Link>
                </Button>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => {
                  const id = Date.now();
                  const score = Math.random() > 0.2 ? Math.round(50 + Math.random() * 50) : null;
                  const statuses = ['approved', 'corrections', 'pending'] as const;
                  const status = statuses[Math.floor(Math.random() * statuses.length)];
                  addDocument({ id, name: `Generated_${id}.pdf`, status: status as DocStatus, score, date: new Date().toLocaleDateString(), type: 'Auto' });
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent/80 px-3 py-1 text-sm font-medium text-background"
              >
                Simulate Result
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="glass-card rounded-xl p-5"
                style={{ animation: "scale-in 0.4s ease-out forwards", animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
                <div className="font-serif text-2xl text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Activity chart placeholder */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Recent Activity
            </h2>
            <div className="h-32 flex items-end gap-2">
              {activity.length ? (
                activity.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-accent/20 hover:bg-accent/40 transition-colors" style={{ height: `${h}%` }} />
                ))
              ) : (
                <div className="text-muted-foreground">No activity yet</div>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Mar 15</span>
              <span>Mar 20</span>
              <span>Mar 25</span>
              <span>Mar 27</span>
            </div>
          </div>

          {/* Documents table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="font-serif text-xl text-foreground">Case History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Document</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const cfg = statusConfig[doc.status];
                    return (
                      <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{doc.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        </td>
                        <td className="p-4">
                          {doc.score !== null ? (
                            <span className={`text-sm font-semibold ${doc.score >= 80 ? 'text-success' : doc.score >= 60 ? 'text-warning' : 'text-destructive'}`}>
                              {doc.score}%
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={cfg.variant} className="text-xs gap-1">
                            <cfg.icon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{doc.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
