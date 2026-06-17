import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Phone, Trash2, Inbox, User, Calendar, MessageSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getInquiries, deleteInquiry } from "@/lib/firebase-utils";

export const Route = createFileRoute("/admin/_layout/messages")({
  component: MessagesPage,
});

type Msg = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date: any;
};

const AVATAR_COLORS = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-fuchsia-400 to-pink-600",
];

function formatDate(date: any) {
  if (!date) return "—";
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(date: any) {
  if (!date) return "";
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function MessagesPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [active, setActive] = useState<Msg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getInquiries((data) => {
      setItems(data as Msg[]);
      setLoading(false);
      if (data.length > 0 && !active) setActive(data[0] as Msg);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (id: string) => {
    try {
      await deleteInquiry(id);
      setActive(null);
      toast.success("Inquiry deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
            <Inbox className="size-6 text-primary" /> Inquiries
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Form submissions from website visitors.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          {items.length} total
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-3xl p-16 text-center text-muted-foreground animate-pulse">
          Loading inquiries…
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <Inbox className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">No inquiries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* Left — list */}
          <div className="glass-card rounded-3xl overflow-hidden flex flex-col max-h-[75vh]">
            <div className="px-4 py-3 border-b border-border/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              All Messages
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-border/40">
              {items.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m)}
                  className={`w-full text-left px-4 py-4 transition-all hover:bg-card/60 ${
                    active?.id === m.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`size-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                    >
                      {m.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-sm truncate">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDate(m.date)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {m.subject || m.message}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right — detail */}
          {active ? (
            <div className="glass-card rounded-3xl p-8 flex flex-col gap-6">
              {/* Top bar */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[items.findIndex((m) => m.id === active.id) % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xl font-bold shadow-md`}
                  >
                    {active.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{active.name}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="size-3.5" />
                      {formatDate(active.date)} · {formatTime(active.date)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full text-destructive hover:text-destructive hover:border-destructive/50"
                  onClick={() => remove(active.id)}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>

              {/* Contact chips */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Mail className="size-3.5" /> {active.email}
                </div>
                {active.phone && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-foreground text-sm font-medium">
                    <Phone className="size-3.5" /> {active.phone}
                  </div>
                )}
              </div>

              {/* Subject */}
              {active.subject && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card/60 border border-border/50">
                  <BookOpen className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Subject
                    </div>
                    <div className="text-sm font-medium">{active.subject}</div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                  <MessageSquare className="size-3.5" /> Message
                </div>
                <div className="p-5 rounded-2xl bg-card/40 border border-border/50 text-sm leading-relaxed text-foreground/90 min-h-32">
                  {active.message}
                </div>
              </div>

              {/* Reply shortcut */}
              <a
                href={`mailto:${active.email}?subject=Re: ${active.subject || "Your inquiry"}`}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full"
              >
                <Mail className="size-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center">
              <User className="mx-auto size-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Select a message to view details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
