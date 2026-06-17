import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ChevronRight, Heart, Home, Info, BookOpen, Image, Mail } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/hooks/use-language";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/news", label: t("nav.gallery") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/contribute", label: t("nav.contribute") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 inset-x-0 z-50 py-0.5 md:py-1"
    >
      <div className="mx-auto max-w-[90rem] px-3 sm:px-4 lg:px-6">
        <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[1.25rem] flex items-center justify-between gap-4 lg:gap-6 xl:gap-12 px-4 sm:px-6 md:px-8 xl:px-10 py-2 sm:py-2.5 shadow-[0_20px_50px_-20px_rgba(127,29,29,0.15)]">
          <Link to="/" className="flex items-center hover:opacity-80 active:scale-95 transition-all">
            <Logo size={40} showText={true} />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item: any) => {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative font-bold text-muted-foreground hover:text-primary transition-all duration-300 group [&.active]:text-primary whitespace-nowrap",
                    "text-[13px] px-2.5 xl:px-4 py-1.5"
                  )}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "active" }}
                >
                  {item.label}
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-1.5 w-1.5 rounded-full bg-secondary opacity-0 scale-0 transition-all duration-500 group-hover:opacity-50 group-hover:scale-100 group-[.active]:opacity-100 group-[.active]:scale-100 shadow-[0_0_10px_oklch(var(--secondary))]" />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#f9f2f0] border border-[#ece1de] rounded-full p-0.5 shadow-sm">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                  language === "en"
                    ? "bg-[#4a1520] text-white shadow-sm"
                    : "text-[#6b5c58] hover:text-[#4a1520]"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                  language === "mr"
                    ? "bg-[#4a1520] text-white shadow-sm"
                    : "text-[#6b5c58] hover:text-[#4a1520]"
                )}
              >
                मराठी
              </button>
            </div>

            <button
              type="button"
              className="lg:hidden rounded-xl p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>

    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] lg:hidden"
        >
          <div
            className="absolute inset-0 bg-primary/10 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[260px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#fdfbf7]">
              <Logo size={28} />
              <button
                onClick={() => setOpen(false)}
                className="size-8 rounded-xl bg-[#fdfbf7] flex items-center justify-center text-[#6b5c58]/60 hover:text-primary transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-6">
              <div className="space-y-1">
                {navItems.map((item: any, idx: number) => {
                  const Icon =
                    idx === 0 ? Home :
                      idx === 1 ? Info :
                        idx === 2 ? Image :
                          idx === 3 ? BookOpen :
                            idx === 4 ? Heart :
                              Mail;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                          "text-[#5c524f] hover:bg-primary/5 hover:text-primary",
                          "[&.active]:bg-primary/10 [&.active]:text-primary"
                        )}
                        activeOptions={{ exact: item.to === "/" }}
                        activeProps={{ className: "active" }}
                      >
                        <Icon className="size-4 opacity-40 group-hover:opacity-100 group-[.active]:opacity-100" />
                        <span className="text-[14px] font-black tracking-tight">{item.label}</span>
                        <ChevronRight className="size-4 ml-auto opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            <div className="p-6 border-t border-slate-50 flex flex-col gap-4">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center bg-[#f9f2f0] border border-[#ece1de] rounded-full p-0.5 shadow-sm max-w-[150px] mx-auto w-full">
                <button
                  onClick={() => {
                    setLanguage("en");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex-1 py-1 rounded-full text-xs font-bold transition-all text-center cursor-pointer",
                    language === "en"
                      ? "bg-[#4a1520] text-white shadow-sm"
                      : "text-[#6b5c58] hover:text-[#4a1520]"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLanguage("mr");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex-1 py-1 rounded-full text-xs font-bold transition-all text-center cursor-pointer",
                    language === "mr"
                      ? "bg-[#4a1520] text-white shadow-sm"
                      : "text-[#6b5c58] hover:text-[#4a1520]"
                  )}
                >
                  मराठी
                </button>
              </div>
              <div className="flex flex-col gap-4 text-center">
                <p className="text-[10px] font-black text-[#6b5c58]/40 uppercase tracking-widest">
                  Bhagini Nivedita Pratishthan
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

