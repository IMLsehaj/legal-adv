import { useState, useEffect, useRef } from "react";
import { FileText, Clock, CheckCircle2, AlertTriangle, TrendingUp, Activity, Calendar, User as UserIcon, MessageSquare, X, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useResults } from "@/contexts/ResultsContext";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType }> = {
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  corrections: { label: "Needs Corrections", variant: "destructive", icon: AlertTriangle },
  pending: { label: "Pending", variant: "secondary", icon: Clock },
};

type Appointment = {
  _id: string;
  client?: { _id: string; name: string; email?: string };
  lawyer?: { _id: string; name: string; email?: string };
  date: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

type ChatMessage = { _id: string; sender: string; receiver: string; content: string; createdAt: string };

const Dashboard = () => {
  const { documents, activity } = useResults();
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [schedulingAppt, setSchedulingAppt] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const [chatUser, setChatUser] = useState<{ id: string; name: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const fetchAppts = async () => {
        setLoadingAppts(true);
        try {
          const res = await fetch(`${API_URL}/api/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setAppointments(data);
          }
        } catch (error) {
          console.error("Failed to fetch appointments", error);
        } finally {
          setLoadingAppts(false);
        }
      };
      fetchAppts();
    }
  }, [user, token]);

  const total = documents.length;
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const correctionsCount = documents.filter((d) => d.status === 'corrections').length;
  const avgScore = Math.round(
    (documents.reduce((acc, d) => acc + (d.score || 0), 0) / Math.max(1, documents.filter((d) => d.score !== null).length)) || 0
  );

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status'], newDate?: string) => {
    try {
      const bodyData: { status: string; date?: string } = { status: newStatus };
      if (newDate) bodyData.date = newDate;

      const res = await fetch(`${API_URL}/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus, ...(newDate && { date: newDate }) } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openChat = async (userId: string, userName: string) => {
    setChatUser({ id: userId, name: userName });
    try {
      const res = await fetch(`${API_URL}/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setChatMessages(await res.json());
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !chatUser || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: chatUser.id, content: newChatMessage }),
      });
      if (res.ok) {
        const msg = await res.json();
        setChatMessages([...chatMessages, msg]);
        setNewChatMessage("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const chatModal = chatUser && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-card rounded-xl w-full max-w-md shadow-2xl border border-border flex flex-col h-[500px]">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-lg">
              {chatUser.name.split(" ").slice(-1)[0][0]}
            </div>
            <h3 className="font-serif text-foreground leading-none">{chatUser.name}</h3>
          </div>
          <button onClick={() => setChatUser(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm mt-10">No messages yet. Start the conversation!</p>
          ) : (
            chatMessages.map((msg) => {
              const isMe = msg.sender === user?._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t bg-muted/10">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input value={newChatMessage} onChange={(e) => setNewChatMessage(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-full bg-background border-border" />
            <Button type="submit" size="icon" className="rounded-full shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  const stats = [
    { icon: FileText, label: 'Total Documents', value: String(total), color: 'text-accent' },
    { icon: CheckCircle2, label: 'Approved', value: String(approvedCount), color: 'text-success' },
    { icon: AlertTriangle, label: 'Need Corrections', value: String(correctionsCount), color: 'text-warning' },
    { icon: TrendingUp, label: 'Avg Score', value: `${avgScore}%`, color: 'text-foreground' },
  ];

  // Lawyer Dashboard View
  if (user?.role === 'lawyer') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        {chatModal}
        {/* Scheduling Modal */}
        {schedulingAppt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="glass-card rounded-xl p-6 max-w-sm w-full shadow-2xl border border-accent/20">
              <h3 className="font-serif text-xl text-foreground mb-2">Schedule Appointment</h3>
              <p className="text-sm text-muted-foreground mb-5">Select a date and time for this consultation.</p>
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <Label>Date & Time</Label>
                  <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSchedulingAppt(null)}>Cancel</Button>
                <Button onClick={() => {
                  if(!scheduleDate || !schedulingAppt) return;
                  handleStatusUpdate(schedulingAppt, 'confirmed', new Date(scheduleDate).toISOString());
                  setSchedulingAppt(null);
                }}>Confirm Time</Button>
              </div>
            </div>
          </div>
        )}
        <div className="pt-24 pb-16">
          <div className="container">
            <div className="mb-10">
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Lawyer Dashboard</h1>
              <p className="text-muted-foreground">Manage your upcoming consultation requests and schedule.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div className="font-serif text-2xl text-foreground">{appointments.length}</div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                </div>
                <div className="font-serif text-2xl text-foreground">{appointments.filter(a => a.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                </div>
                <div className="font-serif text-2xl text-foreground">{appointments.filter(a => a.status === 'confirmed').length}</div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-serif text-xl text-foreground">Appointments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Client</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Notes</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAppts ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading appointments...</td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No appointments found.</td></tr>
                    ) : appointments.map((appt) => (
                      <tr key={appt._id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{appt.client?.name || 'Unknown Client'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {appt.status === 'confirmed' ? (
                            new Date(appt.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                          ) : (
                            <span className="text-muted-foreground italic">Pending schedule</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">{appt.notes || '—'}</td>
                        <td className="p-4">
                          <Badge variant={appt.status === 'confirmed' ? 'default' : appt.status === 'cancelled' ? 'destructive' : 'secondary'} className="text-xs capitalize">
                            {appt.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {appt.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => setSchedulingAppt(appt._id)}>Accept</Button>
                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appt._id, 'cancelled')}>Decline</Button>
                              </>
                            )}
                            {appt.status === 'confirmed' && <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appt._id, 'cancelled')}>Cancel</Button>}
                            <Button size="sm" variant="ghost" className="px-2" onClick={() => appt.client?._id && openChat(appt.client._id, appt.client.name)}>
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Client Dashboard View
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {chatModal}
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

          {/* Consultations Table */}
          <div className="glass-card rounded-xl overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="font-serif text-xl text-foreground">My Consultations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lawyer</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Scheduled Time</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAppts ? (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading consultations...</td></tr>
                  ) : appointments.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No consultations requested yet.</td></tr>
                  ) : appointments.map((appt) => (
                    <tr key={appt._id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{appt.lawyer?.name || 'Advocate'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={appt.status === 'confirmed' ? 'default' : appt.status === 'cancelled' ? 'destructive' : 'secondary'} className="text-xs capitalize">
                          {appt.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {appt.status === 'confirmed' ? new Date(appt.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }) : <span className="text-muted-foreground italic">Awaiting lawyer schedule</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appt._id, 'cancelled')}>Cancel</Button>
                          )}
                          <Button size="sm" variant="ghost" className="px-2" onClick={() => appt.lawyer?._id && openChat(appt.lawyer._id, appt.lawyer.name)}>
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      <tr key={doc._id || doc.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
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
