import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { COURSES, FUTURE_COURSES, ORG } from "@/lib/site-data";
import { GraduationCap, Sparkles, ArrowRight, BookOpen, Languages, Globe, Star, Users, Clock, CreditCard, CheckCircle2, IndianRupee } from "lucide-react";
import { getCourses } from "@/lib/firebase-utils";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/courses/")({
  head: () => ({
    meta: [
      { title: `Professional Courses — ${ORG.short}` },
      {
        name: "description",
        content:
          "Explore expert-led vocational and NGO-focused courses at Bhagini Nivedita Pratishthan, Sangli. Empowering careers since decades.",
      },
      { property: "og:title", content: `Professional Courses — ${ORG.short}` },
      {
        property: "og:description",
        content: "Discover hands-on, high-impact vocational training programs designed for real-world success.",
      },
    ],
  }),
  component: CoursesPage,
});

function FloatingElement({ className, delay = 0, duration = 6 }: { className?: string, delay?: number, duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        y: [0, -20, 0],
        rotate: [0, 10, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className={cn("absolute rounded-full blur-3xl -z-10", className)}
    />
  );
}

import { useLanguage } from "@/hooks/use-language";

function MetaItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col items-center group/meta min-w-0 w-full text-center">
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5 group-hover/meta:bg-primary/20 transition-colors shadow-sm shrink-0">
        <Icon className="size-5 text-primary group-hover/meta:scale-110 transition-transform" />
      </div>
      <div className={cn(
        "text-[#6b5c58]/60 font-black uppercase mb-1 truncate w-full",
        language === "mr" ? "text-[10px] sm:text-[12px] tracking-normal" : "text-[8px] sm:text-[10px] tracking-widest"
      )}>
        {label}
      </div>
      <div className={cn(
        "font-black text-[#2d2624] group-hover:text-primary transition-colors group-hover/meta:text-primary break-words w-full px-1",
        language === "mr" ? "text-[12px] sm:text-[15px]" : "text-[11px] sm:text-[13px]"
      )}>
        {value}
      </div>
    </div>
  );
}

const SANSTHA_COURSES = [
  {
    no: "1",
    name_en: "Operation Theatre Technician",
    name_mr: "ऑपरेशन थिएटर तंत्रज्ञ (OT Technician)",
    eligibility_en: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration_en: "1 Year",
    duration_mr: "१ वर्ष",
    accreditation_en: "Govt Approved",
    accreditation_mr: "शासकीय मान्यताप्राप्त",
    fees_en: "₹20,000",
    fees_mr: "₹२०,०००",
    format_en: "Two days theory classes and four days practical per week",
    format_mr: "दर आठवड्याला २ दिवस थियरी वर्ग आणि ४ दिवस प्रात्यक्षिक",
  },
  {
    no: "2",
    name_en: "General Duty Assistant (GDA)",
    name_mr: "जनरल ड्युटी असिस्टंट (GDA)",
    eligibility_en: "10th Pass",
    eligibility_mr: "१० वी पास",
    duration_en: "Six Months",
    duration_mr: "६ महिने",
    accreditation_en: "Skill India",
    accreditation_mr: "कоशल्या भारत",
    fees_en: "₹6,000",
    fees_mr: "₹६,०००",
    format_en: "Two days theory classes and four days practical per week",
    format_mr: "दर आठवड्याला २ दिवस थियरी वर्ग आणि ४ दिवस प्रात्यक्षिक",
  },
  {
    no: "3",
    name_en: "Home Nursing with Geriatric Care",
    name_mr: "वृद्धाश्रम देखभालीसह गृह परिचारिका",
    eligibility_en: "Min 8th Pass",
    eligibility_mr: "किमान ८ वी पास",
    duration_en: "Six Months",
    duration_mr: "६ महिने",
    accreditation_en: "Private",
    accreditation_mr: "खाजगी",
    fees_en: "₹6,000",
    fees_mr: "₹६,०००",
    format_en: "Two days theory classes and four days practical per week",
    format_mr: "दर आठवड्याला २ दिवस थियरी वर्ग आणि ४ दिवस प्रात्यक्षिक",
  },
  {
    no: "4",
    name_en: "Fashion Designing",
    name_mr: "फॅशन डिझायनिंग",
    eligibility_en: "8th Pass",
    eligibility_mr: "८ वी पास",
    duration_en: "Six Months",
    duration_mr: "६ महिने",
    accreditation_en: "Govt Approved",
    accreditation_mr: "शासकीय मान्यताप्राप्त",
    fees_en: "₹6,000",
    fees_mr: "₹६,०००",
    format_en: "4 hours x 5 days",
    format_mr: "४ तास x ५ दिवस",
  },
  {
    no: "5",
    name_en: "Beauty and Hair",
    name_mr: "ब्युटी आणि हेअर",
    eligibility_en: "8th Pass",
    eligibility_mr: "८ वी पास",
    duration_en: "Six Months",
    duration_mr: "६ महिने",
    accreditation_en: "Govt Approved",
    accreditation_mr: "शासकीय मान्यताप्राप्त",
    fees_en: "₹6,000",
    fees_mr: "₹६,०००",
    format_en: "4 hours x 5 days",
    format_mr: "४ तास x ५ दिवस",
  },
  {
    no: "6",
    name_en: "Fashion Designing (Basic+Advance)",
    name_mr: "फॅशन डिझायनिंग (Basic+Advance)",
    eligibility_en: "8th Pass",
    eligibility_mr: "८ वी पास",
    duration_en: "1 Year",
    duration_mr: "१ वर्ष",
    accreditation_en: "Govt Approved",
    accreditation_mr: "शासकीय मान्यताप्राप्त",
    fees_en: "₹12,000",
    fees_mr: "₹१२,०००",
    format_en: "4 hours x 5 days",
    format_mr: "४ तास x ५ दिवस",
  },
  {
    no: "7",
    name_en: "Beauty and Hair (Basic+Advance)",
    name_mr: "ब्युटी आणि हेअर (Basic+Advance)",
    eligibility_en: "8th Pass",
    eligibility_mr: "८ वी पास",
    duration_en: "1 Year",
    duration_mr: "१ वर्ष",
    accreditation_en: "Govt Approved",
    accreditation_mr: "शासकीय मान्यताप्राप्त",
    fees_en: "₹12,000",
    fees_mr: "₹१२,०००",
    format_en: "4 hours x 5 days",
    format_mr: "४ तास x ५ दिवस",
  },
  {
    no: "8",
    name_en: "Annapoorna",
    name_mr: "अन्नपूर्णा (Annapoorna)",
    eligibility_en: "Literate",
    eligibility_mr: "साक्षर",
    duration_en: "Three Months",
    duration_mr: "३ महिने",
    accreditation_en: "Private",
    accreditation_mr: "खाजगी",
    fees_en: "₹3,000",
    fees_mr: "₹३,०००",
    format_en: "4 hours x 5 days",
    format_mr: "४ तास x ५ दिवस",
  },
];

function CourseCardImage({ src, alt }: { src: string; alt: string }) {
  const [aspectRatio, setAspectRatio] = useState<"landscape" | "portrait" | null>(null);

  return (
    <>
      {aspectRatio === "portrait" && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth > img.naturalHeight) {
            setAspectRatio("landscape");
          } else {
            setAspectRatio("portrait");
          }
        }}
        className={cn(
          "w-full h-full transition-transform duration-700 group-hover:scale-105",
          aspectRatio === "landscape" ? "object-cover" : "object-contain",
          aspectRatio === null ? "opacity-0" : "opacity-100 relative z-10"
        )}
      />
    </>
  );
}

function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const unsubscribe = getCourses((data, error) => {
      if (error) {
        setFirebaseError(error);
      } else {
        setFirebaseError(null);
        const sorted = [...data].sort((a: any, b: any) => {
          const cleanName = (str?: string) => (str || "").toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");
          const indexA = COURSES.findIndex((item) =>
            item.id === a.id ||
            item.id === `c${a.no}` ||
            (cleanName(item.name) === cleanName(a.name))
          );
          const indexB = COURSES.findIndex((item) =>
            item.id === b.id ||
            item.id === `c${b.no}` ||
            (cleanName(item.name) === cleanName(b.name))
          );

          const idxA = indexA !== -1 ? indexA : 9999;
          const idxB = indexB !== -1 ? indexB : 9999;

          if (idxA !== idxB) return idxA - idxB;
          return (Number(a.no) || 0) - (Number(b.no) || 0);
        });
        setCourses(sorted);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#fdfbf7]" style={{ position: 'relative' }}>
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* Main Courses Table Section */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:pt-36 md:pt-40 pb-24 sm:pb-40 relative z-10">
        {/* Intro Text & Image */}
        <div className="mb-16">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 min-h-[300px] sm:min-h-[400px] flex flex-col justify-end group">
            <div 
              className="absolute inset-0 bg-cover bg-[center_top_15%] bg-no-repeat transition-transform duration-1000 group-hover:scale-105 z-0"
              style={{ backgroundImage: 'url(/images/sanstha_group_photo.jpg)' }}
            />
            <div className="relative z-20 w-full max-w-5xl mx-auto p-6 sm:p-10 mt-auto text-center flex flex-col items-center justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/95 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] shadow-lg mb-3 border border-white/20">
                  <span className="size-1.5 rounded-full bg-white inline-block animate-pulse" />
                  {language === "mr" ? "कोर्सेस" : "COURSES"}
                </span>
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight"
                  style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)' }}
                >
                  {t("courses.introTitle")}
                </h2>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mt-8 px-4"
          >
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5c524f] leading-relaxed">
              {t("courses.introText")}
            </p>
          </motion.div>
        </div>
        {/* Available Courses Heading */}
        <div className="mb-16">
          <SectionHeading
            title={t("courses.availableTitle")}
            subtitle={t("courses.availableSubtitle")}
          />
        </div>

        {/* High-Fidelity Cards Grid */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        )}
        {!loading && firebaseError && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
            <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <GraduationCap className="size-8 text-red-400" />
            </div>
            <p className="text-lg font-bold text-red-500 mb-2">Firestore connection error</p>
            <p className="text-sm text-[#5c524f]/60 bg-red-50 rounded-xl px-4 py-2 font-mono">{firebaseError}</p>
            <p className="text-sm text-[#5c524f]/50 mt-4">
              Firebase Console → Firestore → Rules मध्ये <code className="bg-gray-100 px-1 rounded">courses</code> collection ला <strong>read: true</strong> द्या.
            </p>
          </div>
        )}
        {!loading && !firebaseError && courses.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center sm:place-items-stretch">
            {COURSES.map((c, i) => {
              const name = language === "mr" ? c.name_mr : c.name;
              const eligibility = language === "mr" ? c.eligibility_mr : c.eligibility;
              const duration = language === "mr" ? c.duration_mr : c.duration;
              const accreditation = language === "mr" ? c.accreditation_mr : c.accreditation;
              const fees = language === "mr" ? c.fees_mr : c.fees;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-[#ece1de]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_rgba(159,18,57,0.15)] transition-all duration-500 cursor-pointer h-full max-w-[330px] sm:max-w-[340px] md:max-w-[350px] lg:max-w-[360px] mx-auto w-full"
                >
                  {/* Course Image */}
                  <div className="relative w-full h-64 bg-stone-50/50 overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                      <GraduationCap className="size-20 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {/* Floating number badge */}
                    <div className="absolute top-4 left-4 size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary font-black text-sm shadow-lg">
                      {i + 1}
                    </div>
                  </div>

                  {/* Course Name Section */}
                  <div className="px-6 pt-5 pb-1.5 flex items-center gap-4 bg-white min-w-0">
                    {/* Left accent line */}
                    <div className="w-1 h-10 rounded-full bg-primary shrink-0 group-hover:h-12 transition-all duration-300" />
                    <h3 className="font-display text-[1.2rem] font-black text-[#2d2624] group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                      {name}
                    </h3>
                  </div>

                  {/* Info Cards Row (Eligibility, Duration, Fees) */}
                  <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-1.5 bg-white mt-auto">
                    {/* Eligibility */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.eligibility")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {eligibility}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <Clock className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.duration")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {duration}
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <IndianRupee className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.fees")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {fees}
                      </div>
                    </div>
                  </div>

                  {/* Bottom shimmer line */}
                  <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-primary/30 group-hover:w-full transition-all duration-500 ease-out" />
                </motion.div>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center sm:place-items-stretch">
          {courses.map((c, i) => {
            const cleanName = (str?: string) => (str || "").toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");
            const lc = COURSES.find((item) =>
              item.id === c.id ||
              item.id === `c${c.no}` ||
              (cleanName(item.name) === cleanName(c.name))
            );

            const tName1 = t(`courses.names.${c.id}`);
            const tName2 = lc ? t(`courses.names.${lc.id}`) : null;
            const name = language === "mr"
              ? (c.name_mr || lc?.name_mr || (tName1 && !tName1.startsWith("courses.") ? tName1 : null) || (tName2 && !tName2.startsWith("courses.") ? tName2 : null) || c.name || lc?.name || "")
              : (c.name || lc?.name || (tName1 && !tName1.startsWith("courses.") ? tName1 : null) || (tName2 && !tName2.startsWith("courses.") ? tName2 : null) || "");
            const eligibility = (language === "mr" ? (c.eligibility_mr || lc?.eligibility_mr) : null) || c.eligibility || lc?.eligibility || "";
            const duration = (language === "mr" ? (c.duration_mr || lc?.duration_mr) : null) || c.duration || lc?.duration || "";
            const accreditation = (language === "mr" ? (c.accreditation_mr || lc?.accreditation_mr) : null) || c.accreditation || lc?.accreditation || "";
            const fees = (language === "mr" ? (c.fees_mr || lc?.fees_mr) : null) || c.fees || lc?.fees || "";
            const format = (language === "mr" ? (c.format_mr || lc?.format_mr) : null) || c.format || lc?.format || "";

            const isGovt = accreditation.toLowerCase().includes("govt") || accreditation.includes("शासकीय") || accreditation.toLowerCase().includes("msbsvet");

            return (
              <Link
                key={c.id}
                to="/courses/$id"
                params={{ id: c.id }}
                className="block focus:outline-none max-w-[330px] sm:max-w-[340px] md:max-w-[350px] lg:max-w-[360px] mx-auto w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-[#ece1de]/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_rgba(159,18,57,0.15)] transition-all duration-500 cursor-pointer h-full"
                >
                  {/* Course Image */}
                  <div className="relative w-full h-64 bg-stone-50/50 overflow-hidden flex items-center justify-center">
                    {c.image ? (
                      <CourseCardImage src={c.image} alt={name} />
                    ) : (
                      <>
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                          <GraduationCap className="size-20 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </>
                    )}
                    {/* Floating number badge */}
                    {c.no && (
                      <div className="absolute top-4 left-4 size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary font-black text-sm shadow-lg">
                        {c.no}
                      </div>
                    )}
                  </div>

                  {/* Course Name Section */}
                  <div className="px-6 pt-5 pb-1.5 flex items-center gap-4 bg-white min-w-0">
                    {/* Left accent line */}
                    <div className="w-1 h-10 rounded-full bg-primary shrink-0 group-hover:h-12 transition-all duration-300" />
                    <h3 className="font-display text-[1.2rem] font-black text-[#2d2624] group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                      {name}
                    </h3>
                  </div>

                  {/* Info Cards Row (Eligibility, Duration, Fees) */}
                  <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-1.5 bg-white mt-auto">
                    {/* Eligibility */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.eligibility")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {eligibility}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <Clock className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.duration")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {duration}
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="bg-[#fdfbf7] rounded-2xl p-1.5 xs:p-2.5 border border-[#ece1de]/60 flex flex-col items-center justify-center text-center">
                      <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-1.5 shrink-0">
                        <IndianRupee className="size-4" />
                      </div>
                      <div className="text-[8px] uppercase font-bold text-[#6b5c58]/60 tracking-wider mb-0.5 break-words whitespace-normal text-wrap w-full">
                        {t("courses.fees")}
                      </div>
                      <div className="text-[9px] xs:text-[10.5px] font-extrabold text-[#2d2624] break-words whitespace-normal text-wrap w-full">
                        {fees}
                      </div>
                    </div>
                  </div>

                  {/* Bottom shimmer line */}
                  <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-primary/30 group-hover:w-full transition-all duration-500 ease-out" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Skill Development Divider Button */}
        <div className="flex items-center justify-center gap-4 my-12">
          <div className="flex-1 h-px bg-[#c4a882]/30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#6b3f1e] text-white text-[12px] font-black uppercase tracking-[0.18em] shadow-md"
          >
            <GraduationCap className="size-4 shrink-0" />
            {language === "mr" ? "कौशल्य विकास" : "Skill Development"}
          </motion.div>
          <div className="flex-1 h-px bg-[#c4a882]/30" />
        </div>

        {/* Dr. Kusumtai Ghanekar Koushaly Vikas Sanstha - Detailed Table (below cards) */}
        <div className="mt-4">

          {/* Premium styled Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full bg-white rounded-3xl border border-[#ece1de]/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <div className="block md:hidden py-3 px-6 text-center text-[11px] font-black text-primary/70 bg-rose-50/20 border-b border-[#ece1de]/60 tracking-wider">
              {language === "mr" ? "← पूर्ण टेबल पाहण्यासाठी डावीकडे/उजवीकडे स्वाइप करा →" : "← Swipe left/right to view full table →"}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#fcfaf7] border-b border-[#ece1de]/60 text-[#2d2624] font-black uppercase tracking-wider text-[11px] sm:text-xs">
                    <th className="py-5 px-6 w-16 text-center">{t("courses.tableNo")}</th>
                    <th className="py-5 px-6 min-w-[200px]">{t("courses.tableName")}</th>
                    <th className="py-5 px-6 min-w-[120px]">{t("courses.tableEligibility")}</th>
                    <th className="py-5 px-6 min-w-[120px]">{t("courses.tableDuration")}</th>
                    <th className="py-5 px-6 min-w-[150px]">{t("courses.tableAccreditation")}</th>
                    <th className="py-5 px-6 min-w-[120px]">{t("courses.tableFees")}</th>
                    <th className="py-5 px-6 min-w-[250px]">{t("courses.tableFormat")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece1de]/45 text-[#5c524f] font-semibold">
                  {SANSTHA_COURSES.map((row) => (
                    <tr key={row.no} className="hover:bg-amber-50/15 transition-colors">
                      <td className="py-4 px-6 text-center font-black text-[#2d2624]/60">{row.no}</td>
                      <td className="py-4 px-6 font-bold text-[#2d2624]">{language === "mr" ? row.name_mr : row.name_en}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-50 border border-slate-100 text-[#5c524f]">
                          {language === "mr" ? row.eligibility_mr : row.eligibility_en}
                        </span>
                      </td>
                      <td className="py-4 px-6">{language === "mr" ? row.duration_mr : row.duration_en}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${row.accreditation_en.toLowerCase().includes("govt")
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                          {language === "mr" ? row.accreditation_mr : row.accreditation_en}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-primary">{language === "mr" ? row.fees_mr : row.fees_en}</td>
                      <td className="py-4 px-6 text-xs leading-normal">{language === "mr" ? row.format_mr : row.format_en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footnote under the table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex items-center justify-center gap-2.5 text-base font-black text-[#6b5c58]/80 text-center bg-amber-50/30 border border-[#ece1de]/40 rounded-2xl py-4 px-6 max-w-2xl mx-auto"
          >
            <Sparkles className="size-5 text-primary animate-pulse shrink-0" />
            <span>{t("courses.footnote")}</span>
          </motion.div>
        </div>


      </section>
    </div>
  );
}
