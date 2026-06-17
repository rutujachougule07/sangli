import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  watermark?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className, watermark }: Props) {
  const { language } = useLanguage();
  const isMr = language === "mr";

  const getWatermarkText = () => {
    if (watermark) return watermark;
    if (eyebrow) return eyebrow;
    if (title) return title.split(' ')[0];
    return "BNP";
  };

  const watermarkText = getWatermarkText();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "max-w-3xl relative z-10",
        align === "center" ? "text-center mx-auto" : "text-left",
        className,
      )}
    >

      {eyebrow && (
        <span className={cn(
          "inline-flex items-center gap-2 font-black uppercase text-white bg-primary px-5 py-2.5 rounded-full mb-8 shadow-xl shadow-primary/20",
          (isMr && !/^[A-Za-z\s&]+$/.test(eyebrow)) ? "text-[13px] tracking-wide" : "text-[10px] tracking-[0.25em]"
        )}>
          <div className="size-1.5 rounded-full bg-[#a39896] shrink-0" />
          {eyebrow}
        </span>
      )}
      <h2 className={cn(
        "font-display font-black tracking-tight text-[#2d2624] italic",
        isMr
          ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2]"
          : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]",
        align === "center" ? "mx-auto" : ""
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-5 sm:mt-6 text-[#5c524f] leading-relaxed font-semibold max-w-2xl",
          align === "center" ? "mx-auto" : "mr-auto ml-0",
          isMr ? "text-base sm:text-xl md:text-2xl" : "text-sm sm:text-lg md:text-xl"
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

