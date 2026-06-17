import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("bnp_admin_logged_in", "1");
      toast.success("Welcome back, Administrator!");
      navigate({ to: "/admin/dashboard" });
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#FFFBFB]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Logo size={64} />
          </motion.div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 border border-white/50 shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Lock className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Secure Access Only</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
              <input
                id="email"
                type="email"
                defaultValue="admin@bnpsangli.org"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pwd" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</label>
              <input
                id="pwd"
                type="password"
                defaultValue="••••••••"
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium text-slate-700"
              />
            </div>
            
            <button 
              type="submit" 
              className="premium-button w-full group flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl disabled:opacity-70 active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="size-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Designed for BNP Sangli Administrative Excellence
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
