import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ChevronRight, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { ORG } from "@/lib/site-data";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { language, t } = useLanguage();
  
  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/news", label: t("nav.gallery") },
    { to: "/contribute", label: t("nav.contribute") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="mt-12 sm:mt-16 relative overflow-hidden bg-amber-50/20 pt-12 sm:pt-16 border-t border-[#ece1de]/60">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 size-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-secondary/10 blur-[100px] -z-10" />

      <div className="mx-auto max-w-6xl px-6 lg:px-12 pb-8 sm:pb-12">
        <div className="grid gap-10 sm:gap-12 md:gap-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <Logo size={64} />
            </Link>
            <p className="mt-8 text-base text-muted-foreground leading-relaxed font-medium">
              {language === "mr" ? "भगिनी निवेदिता प्रतिष्ठान, सांगली — ५४+ वर्षांची अविरत समाजसेवा आणि सक्षमीकरणाचा वारसा." : `${ORG.name}, ${ORG.city} — a trust built on 54+ years of unwavering community service and women empowerment.`}
            </p>
          </div>

          <div className="flex flex-col sm:items-start text-center sm:text-left w-full sm:w-auto">
            <h4 className="font-display font-black text-foreground uppercase tracking-widest text-[11px] mb-6 sm:mb-4">{t("footer.quickLinks")}</h4>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-0 sm:space-y-4 w-full sm:w-fit">
              {navItems.map((n) => (
                <li key={n.to} className="w-full">
                  <Link
                    to={n.to}
                    className="group/link flex items-center justify-between sm:justify-start w-full px-4 py-3 sm:p-0 rounded-2xl sm:rounded-none bg-white/70 sm:bg-transparent shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] sm:shadow-none border border-[#ece1de]/50 sm:border-transparent text-[13px] sm:text-[15px] font-bold text-[#5c524f] sm:text-muted-foreground hover:text-primary sm:hover:text-primary hover:bg-white sm:hover:bg-transparent transition-all duration-300 hover:shadow-[0_8px_25px_-10px_rgba(251,191,36,0.3)] hover:-translate-y-0.5 sm:hover:translate-y-0"
                  >
                    <div className="flex items-center">
                      <span className="w-0 sm:group-hover/link:w-4 h-0.5 bg-primary mr-0 sm:group-hover/link:mr-3 transition-all rounded-full hidden sm:block" />
                      {n.label}
                    </div>
                    <ChevronRight className="size-4 text-amber-500 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all sm:hidden" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-black text-foreground uppercase tracking-widest text-[11px] mb-8">{t("footer.contactUs")}</h4>
            <div className="space-y-6">
              <a
                href="https://maps.app.goo.gl/kVsRy8rTkx2Bw9rs8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start sm:items-center gap-4 group cursor-pointer"
              >
                <div className="shrink-0 size-11 rounded-full bg-white shadow-md shadow-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">{language === "mr" ? "पत्ता" : "Visit"}</div>
                  <div className="text-sm font-bold text-[#5c524f]/80 leading-tight">{language === "mr" ? "निवेदिता भवन, गणेश दुर्ग, राजवाडा, सांगली - ४१६४१६" : ORG.address}</div>
                </div>
              </a>

              <div className="flex items-start sm:items-center gap-4 group cursor-pointer">
                <div className="shrink-0 size-11 rounded-full bg-white shadow-md shadow-secondary/5 border border-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <Phone className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-0.5">{language === "mr" ? "फोन" : "Call"}</div>
                  <div className="text-sm font-bold text-[#5c524f]/80 leading-tight">{ORG.phone}</div>
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-4 group cursor-pointer">
                <div className="shrink-0 size-11 rounded-full bg-white shadow-md shadow-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <Mail className="size-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">{language === "mr" ? "ईमेल" : "Email"}</div>
                  <div className="text-sm font-bold text-[#5c524f]/80 leading-tight">{ORG.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8 border-white bg-white/50 backdrop-blur-sm self-start">
            <h4 className="font-display font-black text-foreground uppercase tracking-widest text-[11px] mb-6">{language === "mr" ? "संस्था तपशील" : "Organization Details"}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{language === "mr" ? "नोंदणी क्रमांक" : "Registration Number"}</span>
                <span className="font-black text-[#5c524f]">{ORG.registrationNo}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{language === "mr" ? "नोंदणी दिनांक" : "Registered On"}</span>
                <span className="font-black text-[#5c524f]">{ORG.registrationDate}</span>
              </li>
              <li className="pt-4">
                <Link
                  to="/admin"
                  className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all"
                >
                  {language === "mr" ? "ट्रस्ट डॅशबोर्ड" : "Trust Dashboard"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-[#ece1de]/60 flex flex-col sm:flex-row gap-6 sm:gap-6 items-center justify-between">
          <p className="text-[13px] font-bold text-muted-foreground/60 text-center sm:text-left">
            © {new Date().getFullYear()} {language === "mr" ? "भगिनी निवेदिता प्रतिष्ठान, सांगली" : `${ORG.name}, Sangli`}. {t("footer.rights")}
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/share/14r9tavs5sw"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl bg-white border border-[#ece1de]/60 flex items-center justify-center text-[#5c524f]/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]/20 hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/10 transition-all duration-300 shadow-sm"
              title="Facebook"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="https://youtube.com/@bnpsangli?si=bpchd5v0yatytjkx"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-xl bg-white border border-[#ece1de]/60 flex items-center justify-center text-[#5c524f]/70 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]/20 hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/10 transition-all duration-300 shadow-sm"
              title="YouTube"
            >
              <Youtube className="size-5" />
            </a>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black text-primary/40 uppercase tracking-[0.2em] text-center sm:text-right">
            <span className="size-1.5 rounded-full bg-primary/20" />
            {language === "mr" ? "सांगलीमध्ये प्रेमाने साकारलेले" : "Crafted with care in Sangli"}
            <span className="size-1.5 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
