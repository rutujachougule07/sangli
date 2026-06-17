import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
  Heart,
  HandHeart,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_KEY = "bnp_admin_logged_in";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem(ADMIN_KEY)) {
        throw redirect({ to: "/admin/login" });
      }
    }
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/courses", label: "Courses", icon: GraduationCap },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/donors", label: "Donors", icon: Heart },
  { to: "/admin/volunteers", label: "Volunteers", icon: HandHeart },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/reviews", label: "Reviews", icon: Sparkles },
  { to: "/admin/website", label: "Website", icon: Globe },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen flex bg-[#FFFBFB]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-500 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full glass-card lg:rounded-none rounded-r-3xl p-6 flex flex-col border-r border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <Logo size={44} />
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                  activeProps={{
                    className: "bg-primary/5 text-primary",
                  }}
                >
                  <Icon className="size-4.5 group-hover:scale-110 transition-transform" /> 
                  <span>{item.label}</span>
                  {location.pathname === item.to && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button 
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-primary transition-all duration-500 shadow-lg shadow-slate-900/10 active:scale-95" 
              onClick={logout}
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 relative">
        <header className="sticky top-0 z-30 glass-card !rounded-none border-b border-slate-100">
          <div className="flex items-center justify-between px-6 sm:px-10 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <h1 className="font-display font-bold text-slate-800">System Dashboard</h1>
              </div>
            </div>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              View Public Site →
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
