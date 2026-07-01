import { createFileRoute } from '@tanstack/react-router';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Award,
  GraduationCap,
  HeartHandshake,
  Quote,
  Star,
  Calendar,
  Users,
  Shield,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HIGHLIGHTS, STATS, TESTIMONIALS, ORG } from '@/lib/site-data';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { SectionHeading } from '@/components/SectionHeading';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { getReviews, getFoundersSnapshot, getSuccessStories } from '@/lib/firebase-utils';

import { useLanguage } from '@/hooks/use-language';

const AnimatedText = ({ text }: { text: string }) => {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.02
          }
        }
      }}
      className="inline-block"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { 
                type: "spring",
                damping: 15,
                stiffness: 100
              } 
            }
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dynamicReviews, setDynamicReviews] = useState<any[]>([]);
  const [founders, setFounders] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const [activeMobileReview, setActiveMobileReview] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; title: string; videoUrl?: string | null } | null>(null);
  const [successStories, setSuccessStories] = useState<any[]>(TESTIMONIALS);
  const displayReviews: any[] = successStories;

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    const unsubscribe = getReviews((data) => {
      setDynamicReviews(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getSuccessStories((data) => {
      if (data && data.length > 0) {
        setSuccessStories(data);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getFoundersSnapshot((data) => {
      if (data) {
        setFounders(data);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMobileReview((prev) => (prev + 1) % displayReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  const slides = useMemo(() => [
    {
      image: "/images/5.jpeg",
      title: language === "mr" ? "भगिनी निवेदिता प्रतिष्ठान" : "Bhagini Nivedita Pratishthan",
      subtitle: language === "mr" ? "शिक्षण, प्रबोधन आणि सेवेद्वारे महिला सक्षमीकरण" : "Empowering women through education, awareness and service",
      row1: "Bhagini Nivedita",
      row2: "Pratishthan",
      row1Mr: "भगिनी निवेदिता",
      row2Mr: "प्रतिष्ठान"
    },
    {
      image: "/images/nivedita_bhavan.jpg",
      title: language === "mr" ? "नोकरी करणाऱ्या महिलांचे वसतिगृह" : "Working women's hostel",
      subtitle: language === "mr" ? "महिलांसाठी कौशल्य प्रशिक्षण" : "Skill Training For Women",
      row1: "Working women's",
      row2: "hostel",
      row1Mr: "नोकरी करणाऱ्या",
      row2Mr: "महिलांचे वसतिगृह"
    },
    {
      image: "/images/yoga_camp.jpg",
      title: language === "mr" ? "मुलींसाठी बालगृह" : "Baal Gruha for girls",
      subtitle: language === "mr" ? "निराधारांना हक्काचे घर आणि स्वप्नांना नवी दिशा" : "A home for homeless to nourish their dreams",
      row1: "Baal Gruha",
      row2: "for girls",
      row1Mr: "मुलींसाठी",
      row2Mr: "बालगृह"
    }
  ], [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const f1Name = language === "mr" ? (founders?.f1NameMr || t("founders.f1Name")) : (founders?.f1Name || t("founders.f1Name"));
  const f1Desc = language === "mr" ? (founders?.f1DescMr || t("founders.f1Desc")) : (founders?.f1Desc || t("founders.f1Desc"));
  const f1Image = founders?.f1Image || "/images/founder1.jpeg";

  const f2Name = language === "mr" ? (founders?.f2NameMr || t("founders.f2Name")) : (founders?.f2Name || t("founders.f2Name"));
  const f2Desc = language === "mr" ? (founders?.f2DescMr || t("founders.f2Desc")) : (founders?.f2Desc || t("founders.f2Desc"));
  const f2Image = founders?.f2Image || "/images/founder2.jpeg";

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-amber-50/20 overflow-hidden relative" style={{ position: 'relative' }}>
      {/* HERO SECTION - PARALLAX ENABLED */}
      <section className="relative w-full h-[42vh] sm:h-[80vh] md:h-screen min-h-[320px] sm:min-h-[650px] overflow-hidden mt-[108px] sm:mt-[112px] md:mt-[116px]">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              y: i === currentSlide ? heroY : 0,
              scale: i === currentSlide ? heroScale : 1
            }}
          >
            {/* Elegant gradient overlay: darker on the left/bottom to contrast text, but fades out fully to the right/top to keep images bright */}
            <div className="absolute inset-0 bg-black/35 sm:bg-black/25 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className={cn(
                "w-full h-full object-cover object-center",
                slide.image.includes("nivedita_bhavan") ? "scale-[1.05] transition-transform duration-500" : ""
              )}
            />
          </motion.div>
        ))}

        <div className="relative z-20 h-full max-w-[90rem] mx-auto px-4 sm:px-8 md:px-20 lg:px-24 flex flex-col justify-center pt-0 sm:pt-24 md:pt-28 text-center">
          <motion.div
            style={{ opacity: heroOpacity, y: useTransform(scrollYProgress, [0, 0.2], [0, -50]) }}
            className="w-full mx-auto max-w-4xl flex flex-col items-center mt-0 sm:-mt-12 md:-mt-16"
          >
            {/* Main Heading with Slide Animation - taller container to prevent clipping */}
            <div className="relative h-[210px] sm:h-[400px] md:h-[480px] lg:h-[530px] overflow-visible w-full">
              {slides.map((slide, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: idx === currentSlide ? 1 : 0,
                    pointerEvents: idx === currentSlide ? 'auto' : 'none',
                    visibility: idx === currentSlide ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col justify-center items-center w-full"
                >
                  {/* Slide Title - Styled as a Premium Pill Badge */}
                  <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={idx === currentSlide ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex items-center gap-2.5 bg-black/45 backdrop-blur-md border border-white/40 px-5 py-2 rounded-full shadow-lg shadow-black/25"
                    >
                      <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                      <span
                        className="text-amber-400 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] leading-none"
                        style={{ fontFamily: '"Sora", sans-serif' }}
                      >
                        {t("hero.badge")}
                      </span>
                    </motion.div>
                  </div>

                  {/* Main Title - Mobile (Centered Block) */}
                  <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.85 }}
                    animate={idx === currentSlide ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.85 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "mb-6 tracking-tight w-full text-center block sm:hidden text-white",
                      language === "mr"
                        ? "marathi-hero-title text-[1.6rem] xs:text-[2.6rem] leading-[1.12]"
                        : "text-[1.6rem] xs:text-[2.6rem] leading-[1.12] uppercase font-black"
                    )}
                    style={{
                      fontFamily: language === "mr" ? '"Mukta", sans-serif' : 'var(--font-display)',
                      fontWeight: language === "mr" ? 800 : 900,
                      textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,1)',
                    }}
                  >
                    {slide.title}
                  </motion.div>

                  {/* Main Title - Desktop (Staggered Animation) */}
                  <div
                    className={cn(
                      "mb-8 md:mb-10 tracking-tight w-full justify-center text-center hidden sm:flex",
                      language === "mr"
                        ? "marathi-hero-title text-[4.0rem] md:text-[5.0rem] lg:text-[6.0rem] leading-[1.12]"
                        : "text-[4.0rem] md:text-[5.0rem] lg:text-[6.0rem] leading-[1.12] uppercase font-black"
                    )}
                    style={{
                      fontFamily: language === "mr" ? '"Mukta", sans-serif' : 'var(--font-display)',
                      fontWeight: language === "mr" ? 800 : 900,
                      textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,1)',
                    }}
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      {/* Row 1 words side by side */}
                      <div className="flex flex-wrap items-center justify-center gap-5 w-full text-center">
                        {(language === "mr" ? slide.row1Mr : slide.row1).split(" ").map((word, wIdx) => (
                          <motion.span
                            key={wIdx}
                            className="text-white inline-block text-center"
                            initial={{ opacity: 0, y: 60, scale: 0.8 }}
                            animate={idx === currentSlide ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
                            transition={{ duration: 0.7, delay: 0.5 + wIdx * 0.2, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                      {/* Row 2 alone */}
                      <motion.span
                        className={cn(
                          "text-white block text-center w-full",
                          language === "mr" ? "-mt-2 md:-mt-2.5 lg:-mt-4" : "-mt-2"
                        )}
                        initial={{ opacity: 0, y: 60, scale: 0.8 }}
                        animate={idx === currentSlide ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.8 }}
                        transition={{ duration: 0.7, delay: 0.5 + (language === "mr" ? slide.row1Mr : slide.row1).split(" ").length * 0.2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {language === "mr" ? slide.row2Mr : slide.row2}
                      </motion.span>
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={idx === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.7, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "font-bold max-w-2xl leading-relaxed text-white/95 text-center",
                      "text-sm sm:text-2xl tracking-wide sm:tracking-wider"
                    )}
                    style={{ fontFamily: '"Poppins", sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.95)' }}
                  >
                    {slide.subtitle}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Background Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] z-0"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-10 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] z-0"
        />
      </section>

      {/* FOUNDERS SECTION */}
      <section className="py-12 sm:py-20 mx-auto max-w-6xl px-4 relative">
        <SectionHeading
          eyebrow={t("founders.eyebrow")}
          title={t("founders.title")}
          subtitle=""
          className="mb-12 sm:mb-20"
        />

        <div className="flex flex-col gap-12 sm:gap-24">
          {/* Founder 1 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: false }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          >
            <motion.div 
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false }}
              className="w-[75%] sm:w-[55%] md:w-[35%] max-w-[320px] shrink-0 rounded-[2rem] overflow-hidden shadow-xl aspect-[4/5] relative border border-slate-100"
            >
               <img src={f1Image} alt={f1Name} className="w-full h-full object-cover object-top" />
            </motion.div>
            <div className="w-full md:flex-1 text-center max-w-2xl flex flex-col justify-center">
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }}
                  className="h-1.5 w-16 bg-amber-400 rounded-full mb-4 origin-center" 
                />
                <motion.h3 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: false }}
                  className="text-3xl sm:text-4xl font-black text-[#4a1d29] leading-tight drop-shadow-sm"
                >
                  {f1Name}
                </motion.h3>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 size-12 sm:size-20 text-rose-700/5 -z-10 rotate-180" />
                <p className="text-lg sm:text-2xl text-slate-700 leading-relaxed font-medium italic">
                  <AnimatedText text={f1Desc} />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Founder 2 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: false }}
            className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 md:gap-16"
          >
            <motion.div 
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false }}
              className="w-[75%] sm:w-[55%] md:w-[35%] max-w-[320px] shrink-0 rounded-[2rem] overflow-hidden shadow-xl aspect-[4/5] relative border border-slate-100"
            >
               <img src={f2Image} alt={f2Name} className="w-full h-full object-cover object-top" />
            </motion.div>
            <div className="w-full md:flex-1 text-center max-w-2xl flex flex-col justify-center">
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }}
                  className="h-1.5 w-16 bg-amber-400 rounded-full mb-4 origin-center" 
                />
                <motion.h3 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: false }}
                  className="text-3xl sm:text-4xl font-black text-[#4a1d29] leading-tight drop-shadow-sm"
                >
                  {f2Name}
                </motion.h3>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 size-12 sm:size-20 text-rose-700/5 -z-10 rotate-180" />
                <p className="text-lg sm:text-2xl text-slate-700 leading-relaxed font-medium italic">
                  <AnimatedText text={f2Desc} />
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HIGHLIGHTS GRID - ADVANCED SCROLL REVEAL */}
      <section className="py-12 sm:py-20 mx-auto max-w-6xl px-4 relative">
        <div className="w-full">
          <SectionHeading
            eyebrow={t("highlights.eyebrow")}
            title={t("highlights.title")}
            subtitle={t("highlights.subtitle")}
            className="mb-12 sm:mb-20"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 place-items-center sm:place-items-stretch">
            {HIGHLIGHTS.map((h, i) => {
              const Icon = h.icon === 'Shield' ? Shield : h.icon === 'GraduationCap' ? GraduationCap : h.icon === 'Users' ? Users : HeartHandshake;
              const title = t(`highlights.card${i + 1}.title`);
              const desc = t(`highlights.card${i + 1}.desc`);

              return (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  viewport={{ once: false }}
                  className={cn(
                    "group relative rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-9 max-w-[330px] sm:max-w-none w-full h-full border bg-[#fdfbf7]/80 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 flex flex-col overflow-hidden transition-all duration-500"
                  )}
                >
                  <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />

                  <div className="size-12 sm:size-14 rounded-full bg-rose-50 text-primary flex items-center justify-center shadow-md border border-rose-100/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10 mb-4 sm:mb-6">
                    <Icon className="size-6 sm:size-7" />
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-[#2d2624] tracking-tight leading-tight mb-2 sm:mb-3 group-hover:text-primary transition-colors relative z-10">
                    {title}
                  </h3>

                  <p className="text-[#5c524f] font-medium text-sm sm:text-base leading-relaxed mb-0 transition-colors relative z-10">
                    {desc}
                  </p>


                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST PROFILE SECTION */}
      <section className="py-12 mx-auto max-w-6xl px-4 bg-transparent relative overflow-hidden">
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] py-12 px-8 sm:py-16 sm:px-10 border border-[#ece1de]/30 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(159,18,57,0.08)] transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Registration No */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.4 }}
              viewport={{ once: false }}
              className="pt-4 md:pt-0 first:pt-0 flex flex-col items-center md:items-start md:px-6"
            >
              <span className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-widest mb-1.5">
                {language === "mr" ? "नोंदणी क्रमांक" : "Registration No"}
              </span>
              <span className="text-base sm:text-lg font-sans font-bold text-[#2d2624]">
                {ORG.registrationNo}
              </span>
            </motion.div>
            {/* Registration Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              viewport={{ once: false }}
              className="pt-4 md:pt-0 flex flex-col items-center md:items-start md:px-6"
            >
              <span className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-widest mb-1.5">
                {language === "mr" ? "नोंदणी तारीख" : "Registration Date"}
              </span>
              <span className="text-base sm:text-lg font-sans font-bold text-[#2d2624]">
                {ORG.registrationDate}
              </span>
            </motion.div>
            {/* Incorporation Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              viewport={{ once: false }}
              className="pt-4 md:pt-0 flex flex-col items-center md:items-start md:px-6"
            >
              <span className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-widest mb-1.5">
                {language === "mr" ? "स्थापना तारीख" : "Date of Incorporation"}
              </span>
              <span className="text-base sm:text-lg font-sans font-bold text-[#2d2624]">
                {ORG.incorporationDate}
              </span>
            </motion.div>
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              viewport={{ once: false }}
              className="pt-4 md:pt-0 flex flex-col items-center md:items-start md:px-6"
            >
              <span className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-widest mb-1.5">
                {language === "mr" ? "पत्ता" : "Address"}
              </span>
              <span className="text-sm sm:text-base font-sans font-bold text-[#2d2624]">
                {language === "mr" ? "गणेश दुर्ग, राजवाडा परिसर, सांगली - ४१६४१६" : ORG.address}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 sm:py-24 bg-[#4a1520] text-white relative overflow-hidden">
        {/* Subtle decorative background elements instead of the full image overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Left Column: Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
              className="md:col-span-5 flex justify-center"
            >
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40 border border-white/10 relative group">
                <img
                  src="/images/bhagini_nivedita.jpg"
                  alt="Bhagini Nivedita"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>

            {/* Right Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
              className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <span className="text-amber-400 font-bold uppercase tracking-[0.3em] mb-3 text-sm sm:text-base">
                {language === "mr" ? "आमचे ध्येय" : "OUR MOTTO"}
              </span>
              <Quote className="size-10 sm:size-14 text-amber-400/20 mb-4 self-center md:self-start rotate-180" />
              <h2 className="font-display font-black text-white leading-tight mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl max-w-2xl">
                "{t("mission.quote")}"
              </h2>
              <div className="h-0.5 w-12 bg-amber-400 rounded-full mb-4 self-center md:self-start" />
              <p className="text-amber-400 font-sans font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">
                {t("mission.principle")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 mx-auto max-w-6xl px-4 bg-transparent relative overflow-hidden">
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s, i) => {
              const label = i === 0 ? t("stats.years") :
                i === 1 ? t("stats.impact") :
                  i === 2 ? t("stats.courses") :
                    t("stats.success");

              const config = [
                { color: "text-primary", icon: Calendar, bg: "bg-primary/5", iconColor: "text-primary" },
                { color: "text-rose-600", icon: Users, bg: "bg-rose-50", iconColor: "text-rose-600" },
                { color: "text-emerald-600", icon: BookOpen, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
                { color: "text-amber-600", icon: Award, bg: "bg-amber-50", iconColor: "text-amber-600" },
              ][i];

              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  viewport={{ once: false }}
                  className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-7 md:p-9 text-center border border-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(159,18,57,0.1)] transition-all duration-500"
                >
                  <div className={cn("size-10 sm:size-14 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", config.bg)}>
                    <config.icon className={cn("size-5 sm:size-7", config.iconColor)} />
                  </div>
                  <div className={cn("font-sans font-black mb-1 sm:mb-2 flex items-center justify-center gap-0.5", config.color, "text-2xl sm:text-4xl")}>
                    <AnimatedCounter value={parseInt(s.value.toString())} />
                    <span className="font-display">{s.suffix}</span>
                  </div>
                  <div className={cn("font-sans font-bold uppercase text-[#6b5c58]/60 text-center w-full", "text-[8px] sm:text-[10px] tracking-[0.2em]")}>
                    {label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 sm:py-32 bg-[#fdfbf7] mx-auto max-w-6xl px-4 relative overflow-x-hidden">
        <div className="w-full">
          <SectionHeading
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
            subtitle={t("testimonials.subtitle")}
          />

          {/* SUCCESS STORIES SECTION - RESPONSIVE LAYOUT */}
          <div className="mt-8 sm:mt-16 relative py-6 sm:py-10 overflow-hidden">
            {/* Desktop: Auto-scrolling Marquee */}
            <div className="hidden sm:block">
              <div
                className="flex gap-8 whitespace-nowrap w-max animate-marquee-slow"
              >
                {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => {
                  const index = i % TESTIMONIALS.length;
                  const name = language === "mr" ? (item.name_mr || t(`testimonials.card${index + 1}.name`)) : item.name;
                  const role = language === "mr" ? (item.role_mr || t(`testimonials.card${index + 1}.role`)) : item.role;
                  const quote = language === "mr" ? (item.content_mr || t(`testimonials.card${index + 1}.quote`)) : (item.content || t(`testimonials.card${index + 1}.quote`));
                  const avatar = item.avatar || name?.charAt(0) || "B";

                  return (
                    <div
                      key={`${item.name}-${i}`}
                      className="w-[520px] shrink-0 whitespace-normal group"
                    >
                      <div className="h-full rounded-[2.5rem] p-12 bg-[#fdfbf7]/80 backdrop-blur-md border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 flex flex-col relative overflow-hidden transition-all duration-500">
                        <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />
                        <Quote className="absolute top-10 right-10 size-12 text-rose-600/5 group-hover:text-rose-600/10 transition-colors duration-500" />
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                          <div className="size-14 rounded-full bg-rose-50 text-[#2d2624] flex items-center justify-center font-display text-xl font-black shadow-md border border-rose-100/50 transition-all duration-500 group-hover:scale-105 overflow-hidden shrink-0">
                            {item.avatar && typeof item.avatar === 'string' && (item.avatar.startsWith('http') || item.avatar.startsWith('data:')) ? <img src={item.avatar} alt={name} className="size-full object-cover" /> : avatar}
                          </div>
                          <div>
                            <div className="font-display font-black text-[#2d2624] transition-colors duration-300">{name}</div>
                            <div className="text-[10px] font-black text-[#6b5c58]/80 uppercase tracking-widest">{role}</div>
                          </div>
                        </div>
                        <p className="text-[#5c524f] group-hover:text-[#2d2624] transition-colors duration-300">
                          "{quote}"
                        </p>
                        <div className="absolute bottom-0 left-12 right-12 h-1 bg-gradient-to-r from-transparent via-rose-600/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Single Card Carousel with Autoplay & Dots */}
            <div className="block sm:hidden w-full max-w-[380px] mx-auto px-4">
              <div className="relative min-h-[380px] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {(() => {
                    const item = displayReviews[activeMobileReview];
                    if (!item) return null;
                    const name = language === "mr" ? (item.name_mr || t(`testimonials.card${activeMobileReview + 1}.name`)) : item.name;
                    const role = language === "mr" ? (item.role_mr || t(`testimonials.card${activeMobileReview + 1}.role`)) : item.role;
                    const quote = language === "mr" ? (item.content_mr || t(`testimonials.card${activeMobileReview + 1}.quote`)) : (item.content || t(`testimonials.card${activeMobileReview + 1}.quote`));
                    const avatar = item.avatar || name?.charAt(0) || "B";

                    return (
                      <motion.div
                        key={activeMobileReview}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 w-full"
                      >
                        <div className="h-full rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 bg-[#fdfbf7]/80 flex flex-col relative overflow-hidden justify-between">
                          <Quote className="absolute top-5 right-5 size-7 text-rose-600/5" />
                          <div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                              <div className="size-10 rounded-full bg-rose-50 text-[#2d2624] flex items-center justify-center font-display text-base font-black border border-rose-100/50 overflow-hidden shrink-0">
                                {item.avatar && typeof item.avatar === 'string' && (item.avatar.startsWith('http') || item.avatar.startsWith('data:')) ? <img src={item.avatar} alt={name} className="size-full object-cover" /> : avatar}
                              </div>
                              <div>
                                <div className="font-display font-black text-[#2d2624] text-sm">{name}</div>
                                <div className="text-[9px] font-black text-[#6b5c58]/80 uppercase tracking-widest">{role}</div>
                              </div>
                            </div>
                            <p className="text-[#1a1513] font-medium italic leading-relaxed text-sm relative z-10">
                              "{quote}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6 px-2">
                <button
                  onClick={() => setActiveMobileReview((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="size-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="flex gap-1.5 justify-center flex-1 max-w-[200px] overflow-hidden mx-4">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMobileReview(idx)}
                      className={cn(
                        "size-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        idx === activeMobileReview ? "bg-primary w-4" : "bg-primary/20"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveMobileReview((prev) => (prev + 1) % TESTIMONIALS.length)}
                  className="size-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC COMMUNITY REVIEWS SECTION - CAROUSEL (AS REQUESTED BY USER) */}
      {dynamicReviews.length > 0 && (
        <section className="py-20 sm:py-32 bg-[#faf8f5] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow={t("contact.communityTitle")}
              title={t("contact.recentReviews")}
              subtitle={t("contact.reviewsSubtitle")}
            />

            <div className="mt-12 sm:mt-20 relative">
              {/* Desktop: Horizontal Scroll */}
              <div className="hidden sm:block w-full overflow-x-auto pb-12 pt-4 px-4 -mx-4 no-scrollbar cursor-grab active:cursor-grabbing">
                <div className="flex gap-6 sm:gap-8 w-max">
                  {dynamicReviews.map((r, i) => (
                    <div
                      key={r.id}
                      className="group flex-shrink-0 w-[300px] sm:w-[350px] snap-center rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 bg-[#fdfbf7]/80 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(159,18,57,0.08)] hover:-translate-y-2"
                    >
                      <Quote className="absolute top-6 right-6 size-8 sm:size-10 text-rose-600/5 group-hover:text-rose-600/10 transition-colors duration-500" />
                      
                      <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8 relative z-10">
                        <div 
                          className={cn(
                            "size-12 sm:size-14 rounded-full bg-rose-50 text-[#2d2624] flex items-center justify-center font-display text-lg sm:text-xl font-black border border-rose-100/50 shadow-sm transition-transform duration-500 overflow-hidden shrink-0",
                            r.avatar && typeof r.avatar === 'string' && (r.avatar.startsWith('http') || r.avatar.startsWith('data:')) ? "cursor-pointer group-hover:scale-105 hover:ring-2 hover:ring-primary/50" : "group-hover:scale-110"
                          )}
                          onClick={() => {
                            if (r.avatar && typeof r.avatar === 'string' && (r.avatar.startsWith('http') || r.avatar.startsWith('data:'))) {
                              const isVid = r.avatar.includes(".mp4") || r.avatar.includes(".webm") || r.avatar.includes("videos%2F");
                              setLightbox({
                                src: r.avatar,
                                title: r.text || "",
                                videoUrl: isVid ? r.avatar : null
                              });
                            }
                          }}
                        >
                          {r.avatar ? (
                            (typeof r.avatar === 'string' && (r.avatar.includes(".mp4") || r.avatar.includes(".webm") || r.avatar.includes("videos%2F"))) ? (
                              <video src={r.avatar} className="size-full object-cover" muted playsInline />
                            ) : (
                              <img src={r.avatar} alt={r.name} className="size-full object-cover" />
                            )
                          ) : (
                            r.name?.charAt(0) || "B"
                          )}
                        </div>
                        <div>
                          <div className="font-display font-black text-[#2d2624] text-base sm:text-lg">{r.name}</div>
                          <div className="text-[10px] sm:text-xs font-black text-[#6b5c58]/80 uppercase tracking-[0.15em] mt-0.5">{r.role || t("contact.verified")}</div>
                        </div>
                      </div>
                      
                      <div className="relative z-10 flex-1 flex flex-col justify-between">
                        <p className="text-[#5c524f] group-hover:text-[#2d2624] transition-colors duration-300">
                          "{r.text}"
                        </p>
                        <div className="absolute bottom-0 left-12 right-12 h-1 bg-gradient-to-r from-transparent via-rose-600/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: Grid instead of carousel since we just want a list on mobile or carousel */}
              <div className="block sm:hidden w-full px-4">
                <div className="grid grid-cols-1 gap-6">
                  {dynamicReviews.slice(0, 3).map((r, i) => (
                    <div
                      key={r.id}
                      className="group rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 bg-[#fdfbf7]/80 flex flex-col relative overflow-hidden"
                    >
                      <Quote className="absolute top-5 right-5 size-7 text-rose-600/5" />
                      <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div 
                          className={cn(
                            "size-10 rounded-full bg-rose-50 text-[#2d2624] flex items-center justify-center font-display text-base font-black border border-rose-100/50 overflow-hidden shrink-0",
                            r.avatar && typeof r.avatar === 'string' && (r.avatar.startsWith('http') || r.avatar.startsWith('data:')) ? "cursor-pointer" : ""
                          )}
                          onClick={() => {
                            if (r.avatar && typeof r.avatar === 'string' && (r.avatar.startsWith('http') || r.avatar.startsWith('data:'))) {
                              const isVid = r.avatar.includes(".mp4") || r.avatar.includes(".webm") || r.avatar.includes("videos%2F");
                              setLightbox({
                                src: r.avatar,
                                title: r.text || "",
                                videoUrl: isVid ? r.avatar : null
                              });
                            }
                          }}
                        >
                          {r.avatar ? (
                            (typeof r.avatar === 'string' && (r.avatar.includes(".mp4") || r.avatar.includes(".webm") || r.avatar.includes("videos%2F"))) ? (
                              <video src={r.avatar} className="size-full object-cover" muted playsInline />
                            ) : (
                              <img src={r.avatar} alt={r.name} className="size-full object-cover" />
                            )
                          ) : (
                            r.name?.charAt(0) || "B"
                          )}
                        </div>
                        <div>
                          <div className="font-display font-black text-[#2d2624] text-sm">{r.name}</div>
                          <div className="text-[9px] font-black text-[#6b5c58]/80 uppercase tracking-widest">{r.role || t("contact.verified")}</div>
                        </div>
                      </div>
                      <p className="text-[#1a1513] font-medium italic leading-relaxed text-sm relative z-10">
                        "{r.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA WITH PARALLAX BACKGROUND */}
      <section className="relative w-full h-[40vh] min-h-[300px] sm:h-[70vh] sm:min-h-[600px] overflow-hidden flex items-center justify-center px-4 mb-0">
        <motion.div
          style={{ scale: 1.1, y: useTransform(scrollYProgress, [0.8, 1], [0, -30]) }}
          className="absolute inset-0 z-0 bg-black"
        >
          <img
            src="/images/sukanya_sammelan_group_stage.jpg"
            className="w-full h-full object-cover object-center"
            alt="Community"
          />
          {/* Elegant overlay to ensure text readability for centered content */}
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto text-white w-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="w-full flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4 sm:mb-6 flex justify-center w-full -translate-y-8 sm:-translate-y-14">
              <span
                className="text-amber-400 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] bg-black/45 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full shadow-lg shadow-black/25"
                style={{
                  fontFamily: language === "mr" ? '"Mukta", sans-serif' : '"Sora", sans-serif',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                }}
              >
                {language === "mr" ? "टीम निवेदिता" : "Team Nivedita"}
              </span>
            </div>
            <h2 className={cn(
              "leading-tight tracking-tight mb-3 text-center w-full text-white",
              "text-[2.0rem] xs:text-[2.6rem] sm:text-[3.6rem] md:text-[4.8rem] lg:text-[5.6rem]"
            )}
              style={{
                fontFamily: language === "mr" ? '"Mukta", sans-serif' : '"Inter", sans-serif',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              {language === "mr" ? (
                <>चला एकत्र येऊन सकारात्मक प्रभाव पाडूया</>
              ) : (
                <>Let's make an impact together</>
              )}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightbox(null)}
          >
            {/* Soft Light backdrop */}
            <div className="absolute inset-0 bg-[#fcfaf8]/85 backdrop-blur-xl" />

            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 size-12 rounded-full bg-white/50 border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
            >
              <X className="size-6" />
            </button>

            {/* Media container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 max-w-5xl w-full h-auto flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 px-4 sm:px-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-[1.2] flex items-center justify-center min-w-0 w-full">
                {lightbox.videoUrl ? (
                  <video
                    src={lightbox.videoUrl}
                    controls
                    autoPlay
                    className="max-h-[40vh] md:max-h-[70vh] max-w-full w-auto object-contain rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-200/50 bg-slate-50"
                  />
                ) : (
                  <img
                    src={lightbox.src}
                    alt={lightbox.title}
                    className="max-h-[40vh] md:max-h-[70vh] max-w-full w-auto object-contain rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-200/50 bg-white"
                  />
                )}
              </div>
              {lightbox.title && (
                <div className="relative w-full md:w-[320px] lg:w-[380px] flex-shrink-0 flex flex-col bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] max-h-[30vh] md:max-h-[70vh] overflow-hidden group">
                  {/* Decorative ambient glows */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-400/20 rounded-full blur-[40px] pointer-events-none transition-all duration-700 group-hover:bg-rose-400/30" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-[40px] pointer-events-none transition-all duration-700 group-hover:bg-amber-400/30" />

                  <div className="relative z-10 flex flex-col h-full min-h-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-white/60 mb-3 sm:mb-6 shadow-sm backdrop-blur-md w-fit shrink-0">
                      <Info className="size-4 text-amber-500" />
                      <span className="text-slate-700 text-xs font-bold uppercase tracking-widest">{language === "mr" ? "अभिप्राय" : "Review"}</span>
                    </div>

                    <div className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                      <p className="text-[#2d2624] font-medium text-[0.95rem] leading-relaxed text-justify">
                        {lightbox.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Removed WhatsApp Floating Button from here (moved to __root.tsx for site-wide access) */}
    </div>
  );
}
