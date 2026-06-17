import logo from "@/assets/bnp-logo.png";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  showText?: boolean;
};

export function Logo({ size = 44, showText = true }: Props) {
  const { t, language } = useLanguage();
  return (
    <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
      <div
        className="relative flex items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100 group-hover:ring-primary/20 group-hover:scale-105 transition-all duration-500 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img src={logo} alt="BNP Sangli logo" className="w-[85%] h-[85%] object-contain" />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showText && (
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <div className={cn(
            "font-black text-foreground tracking-tight group-hover:text-primary transition-colors",
            language === "mr" ? "text-xs xs:text-sm" : "text-sm xs:text-base sm:text-lg"
          )}
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800 }}
          >
            {t("logo.name")}
          </div>
          <div className={cn(
            "font-black uppercase text-foreground/80 hidden sm:block",
            language === "mr" ? "text-[11px] sm:text-[12px] tracking-normal" : "text-[9px] sm:text-[10px] tracking-[0.14em]"
          )}>
            {t("logo.full")}
          </div>
        </div>
      )}
    </div>
  );
}
