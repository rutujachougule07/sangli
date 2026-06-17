import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { MILESTONES, TEAM, ORG } from "@/lib/site-data";
import { Eye, Target, ListChecks, Trophy, Users, Quote, HeartHandshake, Sparkles, ShieldCheck, Calendar, BookOpen, Heart, Utensils, HeartPulse, Award, GraduationCap, Activity, Home } from "lucide-react";
import { getTeam } from "@/lib/firebase-utils";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Mail, Phone, MapPinIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: `About — ${ORG.name} (BNP), Sangli` },
      {
        name: "description",
        content:
          "Vision, mission, history, milestones and team of Bhagini Nivedita Pratishthan, Sangli.",
      },
      { property: "og:title", content: `About — ${ORG.short}` },
      { property: "og:description", content: "Our vision, mission and journey since 1970." },
    ],
  }),
  component: AboutPage,
});

const VMO = (t: any) => [
  {
    icon: Eye,
    title: t("about.visionTitle"),
    text: t("about.visionText"),
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: Target,
    title: t("about.missionTitle"),
    text: t("about.missionText"),
    gradient: "from-secondary/30 to-secondary/5",
    iconBg: "bg-secondary/40 text-foreground",
  },
  {
    icon: ListChecks,
    title: t("about.objTitle"),
    text: t("about.objText"),
    gradient: "from-accent/30 to-accent/5",
    iconBg: "bg-accent/40 text-foreground",
  },
];

const ACHIEVEMENTS = [
  {
    icon: HeartPulse,
    title: "HIV/AIDS Welfare Pioneer",
    title_mr: "एचआयव्ही/एड्स कार्याचे प्रणेते",
    desc: "First all women organisation in Asia conducting residential project for HIV AIDS affected women.",
    desc_mr: "एचआयव्ही/एड्स (HIV/AIDS) बाधित महिलांसाठी निवासी प्रकल्प चालवणारी आशियातील पहिली महिला संस्था.",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    icon: Home,
    title: "Killari Earthquake Relief",
    title_mr: "किल्लारी भूकंपग्रस्त बालकांना मदत",
    desc: "Provided shelter and education to affected children from Killari earthquake.",
    desc_mr: "किल्लारी येथील भूकंपग्रस्त बाधित बालकांसाठी सुरक्षित निवारा (Shelter) आणि शिक्षणाची सोय केली.",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    icon: Award,
    title: "Dalit Mitra Puraskar",
    title_mr: "दलित मित्र पुरस्कार",
    desc: "Received 'Dalit Mitra Puraskar' from Govt. of Maharashtra for 94-95 and 95-96.",
    desc_mr: "महाराष्ट्र शासनाकडून १९९४-९५ आणि १९९५-९६ या वर्षांसाठीचा प्रतिष्ठित 'दलित मित्र पुरस्कार' प्राप्त.",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    icon: Trophy,
    title: "Punyashlok Ahilyabai Holkar Award",
    title_mr: "पुण्यश्लोक अहिल्याबाई होळकर पुरस्कार",
    desc: "Honoured with 'Punyashlok Ahilyabai Holkar' from Govt. of Maharashtra for 96-97 and 99-2000.",
    desc_mr: "महाराष्ट्र शासनातर्फे समाजकार्यातील योगदानासाठी 'पुण्यश्लोक अहिल्याबाई होळकर पुरस्कार' १९९६-९७ आणि १९९९-२००० या वर्षांसाठी प्राप्त.",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    icon: Award,
    title: "Jankalyan Gaourav Puraskar",
    title_mr: "जनकल्याण गौरव पुरस्कार",
    desc: "Awarded 'Jankalyan Gaourav Puraskar' from Jankalyan Patsanstha, Karad in 2022.",
    desc_mr: "जनकल्याण पतसंस्था, कराड यांच्याकडून २०२२ मध्ये प्रतिष्ठित 'जनकल्याण गौरव पुरस्कार' प्रदान.",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    icon: Trophy,
    title: "Bal Mahotsav Championship",
    title_mr: "बाल महोत्सव जनरल चॅम्पियनशिप",
    desc: "Won the General Championship of Bal Mahotsav 2 times.",
    desc_mr: "बाल महोत्सवात उत्कृष्ट कामगिरी करत २ वेळा जनरल चॅम्पियनशिप (सर्वसाधारण विजेतेपद) पटकावले.",
    bg: "bg-rose-50 text-rose-600",
  },
];

// Refined consistent palette for team cards matching Rose theme
const TEAM_ACCENT_COLOR = "bg-primary"; // Wine Pink
const TEAM_TEXT_COLOR = "text-primary";    // Deep Rose

const ROLE_ORDER: Record<string, number> = {
  President: 1,
  "Vice President": 2,
  Secretary: 3,
  "Joint Secretary": 4,
  Treasurer: 5,
  "Joint Treasurer": 6,
  "Programme Head": 7,
  "Outreach Head": 8,
  Member: 9,
};

function sortTeam(members: any[]) {
  return [...members].sort((a, b) => {
    const aOrder = ROLE_ORDER[a.role] ?? 99;
    const bOrder = ROLE_ORDER[b.role] ?? 99;
    return aOrder - bOrder;
  });
}


import { useLanguage } from "@/hooks/use-language";

const FloatingShape = ({ className, delay = 0, duration = 15 }: { className: string; delay?: number; duration?: number }) => (
  <motion.div
    animate={{
      y: [0, 100, 0],
      x: [0, 50, 0],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 0],
    }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    className={cn("absolute rounded-full blur-[100px] -z-10 opacity-30", className)}
  />
);

function AboutPage() {
  const [team, setTeam] = useState<any[]>(sortTeam(TEAM));
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const vmoItems = [
    {
      icon: Eye,
      title: t("about.visionTitle"),
      text: t("about.visionText"),
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15 text-primary",
    },
    {
      icon: Target,
      title: t("about.missionTitle"),
      text: t("about.missionText"),
      gradient: "from-secondary/30 to-secondary/5",
      iconBg: "bg-secondary/40 text-foreground",
    },
    {
      icon: ListChecks,
      title: t("about.objTitle"),
      text: t("about.objText"),
      gradient: "from-accent/30 to-accent/5",
      iconBg: "bg-accent/40 text-foreground",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const unsubscribe = getTeam((data) => {
      const valid = data.filter((d) => d.name && d.name.trim() !== "");
      
      // Merge static TEAM with Firebase data
      const merged = TEAM.map(staticMember => {
        const fireMember = valid.find(f => f.name === staticMember.name);
        return fireMember ? { ...staticMember, ...fireMember } : staticMember;
      });
      
      // Add any totally new members from Firebase
      const newMembers = valid.filter(f => !TEAM.some(t => t.name === f.name));
      
      setTeam(sortTeam([...merged, ...newMembers]));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden relative" style={{ position: 'relative' }}>
      <FloatingShape className="top-[10%] left-[-5%] size-[500px] bg-primary/10" delay={0} />
      <FloatingShape className="top-[40%] right-[-10%] size-[600px] bg-secondary/10" delay={2} duration={20} />
      <FloatingShape className="bottom-[10%] left-[-10%] size-[400px] bg-emerald-400/10" delay={4} />
      <FloatingShape className="bottom-[30%] right-[5%] size-[500px] bg-amber-400/10" delay={1} duration={25} />
      <section className="relative w-full h-[42vh] sm:h-[75vh] flex items-center justify-center overflow-hidden mt-[108px] sm:mt-[112px] md:mt-[116px]">
        <div className="absolute inset-0">
          <img
            src="/images/sukanya_sammelan_5_people.jpg"
            alt="About BNP"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center w-full relative z-10 -mt-12 sm:-mt-16">
          <motion.div
            style={{ opacity: heroOpacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={cn(
              "font-sans font-bold text-white leading-tight tracking-tight",
              "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
            )}>
              <>{t("about.heroTitle")}</>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* VMO SECTION */}
      <section className="relative -mt-4 sm:-mt-12 z-20 mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center sm:place-items-stretch">
          {VMO(t).map((c: any, i: number) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, type: "spring", stiffness: 60 }}
              className={cn(
                "group relative rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-9 max-w-[330px] sm:max-w-none w-full h-full border bg-[#fdfbf7]/80 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 flex flex-col overflow-hidden transition-all duration-500"
              )}
            >
              <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />

              <div className="relative mb-4 sm:mb-6 z-10">
                <div className="relative size-12 sm:size-14 rounded-full bg-rose-50 text-primary flex items-center justify-center shadow-md border border-rose-100/50 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  <c.icon className="size-6 sm:size-7" />
                </div>
              </div>

              <h3 className={cn(
                "font-sans font-bold text-primary tracking-tight leading-tight group-hover:scale-105 transition-transform duration-500 relative z-10",
                "text-lg sm:text-2xl"
              )}>
                {c.title}
              </h3>
              <p className={cn(
                "mt-2 sm:mt-3 text-[#5c524f] leading-relaxed font-medium relative z-10 whitespace-pre-line",
                "text-sm sm:text-base"
              )}>
                {c.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HISTORY WITH PARALLAX */}
      <section className="py-14 sm:py-20 mx-auto max-w-6xl px-4 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10" />

        <div className="glass-card rounded-[2.5rem] sm:rounded-[4rem] p-4 sm:p-10 md:p-12 relative overflow-hidden border-white/50 shadow-2xl shadow-primary/5">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] -z-10" />
          <div className="absolute -top-40 -left-40 size-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 size-80 bg-secondary/10 rounded-full blur-3xl" />
          <div className="grid gap-10 sm:gap-16 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <SectionHeading
                eyebrow={t("about.historyEyebrow")}
                title={t("about.historyTitle")}
                align="left"
                className="!mx-0 font-sans"
              />
              <p className="mt-6 sm:mt-10 text-base sm:text-xl text-[#5c524f] leading-relaxed font-medium">
                {t("about.historyText1")}
              </p>
              <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-[#6b5c58] leading-relaxed">
                {t("about.historyText2")}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { value: "55+", label: t("stats.years"), color: "text-primary", icon: Calendar, bg: "bg-primary/5", iconColor: "text-primary" },
                { value: "12,000+", label: t("stats.impact"), color: "text-rose-600", icon: Users, bg: "bg-rose-50", iconColor: "text-rose-600" },
                { value: "10+", label: t("stats.courses"), color: "text-emerald-600", icon: BookOpen, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
                { value: "130+", label: t("stats.success"), color: "text-amber-600", icon: Heart, bg: "bg-amber-50", iconColor: "text-amber-600" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative bg-white/90 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-7 md:p-9 text-center border border-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(159,18,57,0.1)] transition-all duration-500"
                >
                  <div className={cn("size-10 sm:size-14 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", s.bg)}>
                    <s.icon className={cn("size-5 sm:size-7", s.iconColor)} />
                  </div>
                  <div className={cn("font-sans font-black mb-1 sm:mb-2", s.color, "text-2xl sm:text-4xl")}>
                    {s.value}
                  </div>
                  <div className={cn("font-sans font-bold uppercase text-[#6b5c58]/60", "text-[8px] sm:text-[10px] tracking-[0.2em]")}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONES - WAVY ROAD INFOGRAPHIC */}
      <section className="py-20 sm:py-32 relative bg-[#fdfbf7] overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <SectionHeading
            eyebrow={language === "mr" ? "टप्पे" : "Milestones along the way"}
            title={t("about.milestoneTitle")}
            subtitle={language === "mr" ? "आमचा ५० वर्षांचा वारसा परिभाषित करणारे महत्त्वाचे क्षण." : "Key moments that defined our 50-year legacy."}
          />
        </div>

        {/* Wavy Road Container */}
        <div className="relative max-w-3xl mx-auto mt-12 sm:mt-20 px-2 pb-10">
          
          <div className="flex flex-col w-full relative z-10">
            {MILESTONES.map((m, i) => {
              const icons = [ShieldCheck, ListChecks, Target, HeartHandshake, Sparkles, Trophy, HeartHandshake, ShieldCheck, ListChecks, Target, Sparkles, Trophy];
              const Icon = icons[i % icons.length];
              
              const colors = [
                "#10b981", // Emerald/Teal
                "#3b82f6", // Blue
                "#8b5cf6", // Purple
                "#ec4899", // Pink
                "#ef4444", // Red
                "#f59e0b"  // Amber/Orange
              ];
              const bg = colors[i % colors.length];
              const isRight = i % 2 === 0;

              // Control points for the SVG bezier curve to make S-shapes
              const apexX = isRight ? 86 : 14;
              const cpX = isRight ? 100 : 0;

              return (
                <motion.div
                  key={`${m.year}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full min-h-[200px] sm:min-h-[260px]"
                >
                  {/* SVG Wavy Road Segment */}
                  <svg className="absolute inset-0 size-full z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100" overflow="visible">
                    <path 
                      d={`M 50,0 C ${cpX},20 ${cpX},80 50,100`} 
                      fill="none" 
                      stroke="#1f2937" 
                      strokeWidth="44" 
                      vectorEffect="non-scaling-stroke" 
                    />
                    <path 
                      d={`M 50,0 C ${cpX},20 ${cpX},80 50,100`} 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="4" 
                      strokeDasharray="12 12" 
                      vectorEffect="non-scaling-stroke" 
                      opacity="0.8"
                    />
                  </svg>

                  {/* Circle at Apex */}
                  <div 
                    className="absolute top-1/2 z-20"
                    style={{ left: `${apexX}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div 
                      className="size-16 sm:size-24 rounded-full border-4 sm:border-[6px] border-white shadow-2xl flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:rotate-12" 
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="size-7 sm:size-10 text-white drop-shadow-md" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div 
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-[46%] sm:w-[42%] z-20 flex flex-col justify-center",
                      isRight ? "left-[2%] sm:left-[6%] text-right items-end" : "left-[52%] sm:left-[52%] text-left items-start"
                    )}
                  >

                    <h3 className="text-2xl sm:text-4xl font-black mb-2 uppercase tracking-wide drop-shadow-sm" style={{ color: bg }}>
                      {m.year}
                    </h3>
                    <p className="text-[11px] sm:text-[15px] text-slate-600 font-semibold leading-snug sm:leading-relaxed line-clamp-6">
                      {language === "mr" ? m.text_mr : m.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Fading gradients at top and bottom to blend the road smoothly */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
        </div>
      </section>


      {/* ACHIEVEMENTS SECTION */}
      <section className="py-24 sm:py-32 mx-auto max-w-6xl px-4 relative bg-white">
        <div className="w-full">
          <SectionHeading
            eyebrow={language === "mr" ? "यशस्वी वाटचाल" : "Achievements"}
            title={language === "mr" ? "यश हे दररोज केलेल्या लहान प्रयत्नांचे फळ आहे." : "Success is the sum of small efforts repeated daily."}
            subtitle={language === "mr" ? "गेल्या ५ दशकांहून अधिक काळ आम्ही समाजकार्यात मिळवलेले यश." : "A testament to over five decades of service and transformation."}
          />

          <div className="mt-20 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center sm:place-items-stretch">
            {ACHIEVEMENTS.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.7, type: "spring", stiffness: 50 }}
                  className="group relative bg-[#fdfbf7]/80 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] transition-all duration-500 overflow-hidden max-w-[330px] sm:max-w-none w-full"
                >
                  <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                  
                  <div className={cn("size-14 sm:size-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 mb-6 sm:mb-8", a.bg)}>
                    <Icon className="size-6 sm:size-8" />
                  </div>
                  
                  <h4 className="text-lg sm:text-2xl font-sans font-bold text-[#2d2624] mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    {language === "mr" ? a.title_mr : a.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#6b5c58] font-medium leading-relaxed">
                    {language === "mr" ? a.desc_mr : a.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM - INTERACTIVE CARDS */}
      <section className="py-12 sm:py-20 mx-auto max-w-6xl px-4 pb-12 sm:pb-24">
        <SectionHeading
          eyebrow={language === "mr" ? "आमचे लोक" : "Our people"}
          title={t("about.teamTitle")}
          subtitle={t("about.teamSubtitle")}
          className="mb-24 sm:mb-32 font-sans"
        />
        <div className="grid gap-x-6 sm:gap-x-8 gap-y-20 sm:gap-y-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center sm:place-items-stretch">
          {team.map((p, i) => {
            const defaultMember = TEAM.find(m => m.name === p.name);
            let displayName = language === "mr" ? (p.name_mr || defaultMember?.name_mr || p.name) : p.name;
            if (language === "mr" && displayName?.includes("शार्ईली")) {
              displayName = displayName.replace("शार्ईली", "शार्दुली");
            }
            const displayRole = language === "mr" ? (
              p.role === "President" ? "अध्यक्षा" :
              p.role === "Vice President" ? "उपाध्यक्षा" :
              p.role === "Secretary" ? "सचिव" :
              p.role === "Joint Secretary" ? "सहसचिव" :
              p.role === "Treasurer" ? "खजिनदार" :
              p.role === "Joint Treasurer" ? "सह-खजिनदार" :
              p.role === "Programme Head" ? "कार्यक्रम प्रमुख" :
              p.role === "Outreach Head" ? "संपर्क प्रमुख" :
              p.role === "Member" ? "सदस्य" :
              p.role
            ) : p.role;
            const displayDesc = language === "mr" ? (p.description_mr || defaultMember?.description_mr || `${displayName} हे भगिनी निवेदिता प्रतिष्ठानचे एक महत्त्वाचे आधारस्तंभ आहेत, जे सेवा आणि उत्कृष्टतेसाठी समर्पित आहेत.`) : (p.description || defaultMember?.description || `${p.name} is a key pillar of Bhagini Nivedita Pratishthan, dedicated to service and excellence.`);

            return (
              <Dialog key={p.name ?? i}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    whileHover={{ y: -16 }}
                    className="group relative bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 pt-16 sm:pt-20 max-w-[330px] sm:max-w-none w-full border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(159,18,57,0.15)] transition-all duration-700 cursor-pointer text-center overflow-visible"
                  >
                    {/* Decorative Background Element */}
                    <Quote className="absolute top-8 right-8 size-14 sm:size-16 text-primary/5 group-hover:text-primary/10 transition-all duration-700 -rotate-12" />

                    <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative">
                        {/* Animated Glow Ring */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative size-20 sm:size-28 rounded-full p-1.5 bg-white shadow-2xl ring-2 ring-primary/5 transition-transform duration-700"
                        >
                          {p.url ? (
                            <img
                              src={p.url}
                              alt={p.name}
                              className="size-full rounded-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="size-full rounded-full bg-slate-50 flex items-center justify-center font-display text-3xl sm:text-4xl font-black text-primary">
                              {p.initials || p.name?.charAt(0)}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-sans font-bold text-[#2d2624] tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {displayName}
                    </h3>

                    <p className={cn(
                      "mt-2 sm:mt-3 font-black uppercase tracking-[0.3em] text-primary/40 group-hover:text-primary transition-colors",
                      "text-[10px] sm:text-xs"
                    )}>
                      {displayRole}
                    </p>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[320px] sm:max-w-[400px] rounded-[2rem] sm:rounded-[2.5rem] p-0 overflow-visible border-[5px] border-white bg-[#fdfbf7]/95 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] ring-2 ring-black/5 mx-auto outline-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 200,
                      duration: 0.6
                    }}
                    className="relative w-full h-full"
                  >
                    {/* Profile Header Background */}
                    <div className="h-20 sm:h-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden rounded-t-[1.8rem] sm:rounded-t-[2.3rem]">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>

                    {/* Avatar positioned perfectly centered on the color boundary */}
                    <div className="absolute top-8 sm:top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 z-20">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          damping: 15,
                          stiffness: 150,
                          delay: 0.1
                        }}
                        className="size-24 sm:size-32 rounded-full bg-white p-1.5 shadow-2xl shadow-black/20 ring-1 ring-slate-100"
                      >
                        {p.url ? (
                          <img
                            src={p.url}
                            alt={p.name}
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="size-full rounded-full bg-slate-50 flex items-center justify-center font-display text-3xl sm:text-4xl font-black text-primary">
                            {p.initials || p.name?.charAt(0)}
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Role Badge next to photo */}
                    <div className="absolute top-[136px] sm:top-[120px] left-1/2 -translate-x-1/2 sm:left-[200px] sm:translate-x-0 z-30">
                      <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 w-fit"
                      >
                        <ShieldCheck className="size-2.5 sm:size-3 text-primary" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                          {displayRole}
                        </span>
                      </motion.div>
                    </div>

                    <div className="px-5 sm:px-8 pt-32 sm:pt-20 pb-4 sm:pb-5">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.1,
                              delayChildren: 0.1
                            }
                          }
                        }}
                      >
                        {/* ONLY Name in a Row below photo */}
                        <div className="mb-4">
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 }
                            }}
                          >
                            <DialogTitle className="text-xl sm:text-2xl font-sans font-bold text-[#2d2624] leading-tight tracking-tight text-center sm:text-left">
                              {displayName}
                            </DialogTitle>
                          </motion.div>
                        </div>
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, scaleX: 0 },
                            visible: { opacity: 1, scaleX: 1 }
                          }}
                          className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-2 mb-3"
                        />

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                          }}
                        >
                          <DialogDescription className="text-sm sm:text-base text-[#5c524f] leading-relaxed font-semibold italic opacity-90 text-center sm:text-left">
                            {displayDesc}
                          </DialogDescription>
                        </motion.div>

                        <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-2">
                          {[
                            { icon: Mail, value: ORG.email, color: "text-primary", bg: "bg-primary/5" },
                            { icon: Phone, value: ORG.phone, color: "text-secondary", bg: "bg-secondary/5" }
                          ].map((item, idx) => (
                            <motion.div
                              key={idx}
                              variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                              }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
                            >
                              <div className={cn("size-8 sm:size-10 rounded-xl flex items-center justify-center shadow-inner border border-white/40 transition-transform group-hover:scale-110", item.bg, item.color)}>
                                <item.icon className="size-4 sm:size-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.icon === Mail ? "Email Address" : "Phone Number"}</span>
                                <span className="text-[13px] sm:text-sm font-sans font-bold text-slate-800 tracking-tight">{item.value}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <DialogClose asChild>
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, scale: 0.9 },
                              visible: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button className="mt-4 sm:mt-5 w-full h-9 sm:h-10 rounded-xl font-bold text-xs sm:text-sm bg-slate-950 hover:bg-primary transition-all duration-500 text-white shadow-2xl hover:shadow-primary/30 relative overflow-hidden group">
                              <span className="relative z-10">{language === "mr" ? "टीम कडे परत जा" : "Back to Team"}</span>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"
                                initial={false}
                              />
                            </Button>
                          </motion.div>
                        </DialogClose>
                      </motion.div>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </section>
    </div>
  );
}


