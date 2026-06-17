import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { getCourse, saveInquiry } from "@/lib/firebase-utils";
import { COURSES, ORG } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, GraduationCap, IndianRupee, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/_public/courses/$id")({
  component: CourseDetailsPage,
});

import { useLanguage } from "@/hooks/use-language";

function CourseDetailsPage() {
  const { id } = Route.useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    async function load() {
      // Try Firebase first
      const data = await getCourse(id);
      if (data) {
        setCourse(data);
      } else {
        // Fallback to static courses
        const staticCourse = COURSES.find((c) => c.id === id);
        setCourse(staticCourse);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold">{t("courses.notFound")}</h2>
        <p className="mt-2 text-muted-foreground">{t("courses.notFoundText")}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/courses">{t("courses.back")}</Link>
        </Button>
      </div>
    );
  }

  const cleanName = (str?: string) => (str || "").toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");
  const lc = COURSES.find((item) => 
    item.id === course.id || 
    item.id === `c${course.no}` || 
    (cleanName(item.name) === cleanName(course.name))
  );

  const tName1 = t(`courses.names.${course.id}`);
  const tName2 = lc ? t(`courses.names.${lc.id}`) : null;
  const name = language === "mr"
    ? (course.name_mr || lc?.name_mr || (tName1 && !tName1.startsWith("courses.") ? tName1 : null) || (tName2 && !tName2.startsWith("courses.") ? tName2 : null) || course.name || lc?.name || "")
    : (course.name || lc?.name || (tName1 && !tName1.startsWith("courses.") ? tName1 : null) || (tName2 && !tName2.startsWith("courses.") ? tName2 : null) || "");

  const tDesc1 = t(`courses.descriptions.${course.id}`);
  const tDesc2 = lc ? t(`courses.descriptions.${lc.id}`) : null;
  const description = language === "mr"
    ? (course.description_mr || lc?.description_mr || (tDesc1 && !tDesc1.startsWith("courses.") ? tDesc1 : null) || (tDesc2 && !tDesc2.startsWith("courses.") ? tDesc2 : null) || course.description || lc?.description || "")
    : (course.description || lc?.description || (tDesc1 && !tDesc1.startsWith("courses.") ? tDesc1 : null) || (tDesc2 && !tDesc2.startsWith("courses.") ? tDesc2 : null) || "");

  const format = language === "mr" ? (course.format_mr || lc?.format_mr || course.format || lc?.format || "") : (course.format || lc?.format || "");
  const eligibility = language === "mr" ? (course.eligibility_mr || lc?.eligibility_mr || course.eligibility || lc?.eligibility || "") : (course.eligibility || lc?.eligibility || "");
  const duration = language === "mr" ? (course.duration_mr || lc?.duration_mr || course.duration || lc?.duration || "") : (course.duration || lc?.duration || "");
  const fees = language === "mr" ? (course.fees_mr || lc?.fees_mr || course.fees || lc?.fees || "") : (course.fees || lc?.fees || "");

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 pt-28 sm:pt-36 md:pt-40 pb-20">
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm text-[#6b5c58]/80 hover:text-primary transition-colors mb-10 group"
      >
        <span className="size-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
        </span>
        {t("courses.back")}
      </Link>

      <div className="grid gap-12 lg:grid-cols-3 items-start">
        {/* Course Info */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-14 border border-white/60 shadow-2xl shadow-primary/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="size-24 sm:size-32 rounded-2xl sm:rounded-[2rem] overflow-hidden border-4 sm:border-8 border-white bg-white shadow-xl sm:rotate-3 shrink-0 mx-auto sm:mx-0"
              >
                {course.image ? (
                  <img src={course.image} alt={name} className="size-full object-contain bg-stone-50/50" />
                ) : (
                  <div className="size-full bg-primary/5 flex items-center justify-center text-primary/20">
                    <GraduationCap className="size-12" />
                  </div>
                )}
              </motion.div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20 mb-3 sm:mb-4">
                  {format} {t("courses.formatLabel")}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2d2624] balance leading-tight">
                  {name}
                </h1>
              </div>
            </div>

            <div className="grid gap-2 xs:gap-3 sm:gap-6 grid-cols-3">
              <InfoCard
                icon={CheckCircle2}
                label={t("courses.eligibility")}
                value={eligibility}
                delay={0.1}
              />
              <InfoCard
                icon={Clock}
                label={t("courses.duration")}
                value={duration}
                delay={0.2}
              />
              <InfoCard
                icon={IndianRupee}
                label={t("courses.fees")}
                value={fees}
                delay={0.3}
              />
            </div>

            <div className="mt-14 space-y-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-display text-2xl font-bold mb-5 flex items-center gap-3">
                  <span className="size-1 w-8 bg-primary rounded-full" /> {t("courses.aboutTitle")}
                </h3>
                <p className="text-[#5c524f] leading-relaxed text-lg">
                  {description ||
                    (language === "mr" 
                      ? "भगिनी निवेदिता प्रतिष्ठान (BNP) सांगली समुदायाच्या सक्षमीकरणासाठी खास डिझाइन केलेले उच्च-गुणवत्तेचे व्यावसायिक प्रशिक्षण प्रदान करते. हा कोर्स व्यावसायिक क्षेत्रात यशस्वी होण्यासाठी आवश्यक असलेले प्रत्यक्ष व्यावहारिक अनुभव आणि सैद्धांतिक ज्ञान प्रदान करतो."
                      : "Bhagini Nivedita Pratishthan (BNP) Sangli provides high-quality vocational training specifically designed for community empowerment. This course offers hands-on practical experience and theoretical knowledge required to succeed in the professional field.")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Inquiry Form Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-28 space-y-6"
        >
          <div className="bg-card border-2 border-white shadow-2xl shadow-primary/10 rounded-[2.5rem] p-5 sm:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

            <div className="relative">
              <h3 className="font-display text-2xl font-bold text-[#2d2624]">{t("courses.inquiryTitle")}</h3>
              <p className="mt-4 text-base text-[#5c524f] leading-relaxed font-medium">
                {t("courses.inquiryText")}
              </p>

              <div className="mt-8 space-y-6">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center shadow-inner">
                  <p className="text-[11px] uppercase font-bold text-primary tracking-widest mb-3">
                    Contact / WhatsApp
                  </p>
                  <a
                    href={`tel:${ORG.phone}`}
                    className="block font-display text-2xl xs:text-3xl font-black text-primary hover:text-secondary transition-colors mb-6 drop-shadow-sm"
                  >
                    {ORG.phone}
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full rounded-2xl h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 border-0">
                        {t("courses.contactOptions")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[calc(100vw-3rem)] max-w-sm sm:w-64 rounded-2xl p-2 bg-white/95 backdrop-blur-xl border-white/50 shadow-[0_10px_40px_-10px_oklch(0.45_0.16_25/0.15)]">
                      <DropdownMenuItem asChild>
                        <a
                          href={`tel:${ORG.phone}`}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[15px] font-bold text-primary rounded-xl cursor-pointer hover:bg-primary/10"
                        >
                          <Phone className="size-5" />
                          {t("courses.callDirect")}
                        </a>
                      </DropdownMenuItem>
                      <div className="h-px bg-slate-100 my-1 mx-2" />
                      <DropdownMenuItem asChild>
                        <a
                          href={`https://wa.me/91${ORG.phone?.replace(/[^0-9]/g, "").slice(-10)}?text=${
                            language === "mr"
                              ? encodeURIComponent(`नमस्कार, मला ${name} या कोर्सबद्दल विचारणा करायची आहे.`)
                              : encodeURIComponent(`Hello, I would like to inquire about the ${name} course.`)
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full px-4 py-3 text-[15px] font-bold text-[#25D366] rounded-xl cursor-pointer hover:bg-[#25D366]/10"
                        >
                          <WhatsAppIcon className="size-5 shrink-0" />
                          {t("courses.whatsappMsg")}
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: any;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white shadow-sm hover:shadow-lg transition-all group/info flex flex-col items-center sm:items-start text-center sm:text-left"
    >
      <div className="size-8 sm:size-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 sm:mb-4 group-hover/info:bg-primary group-hover/info:text-white transition-colors shrink-0">
        <Icon className="size-4 sm:size-6" />
      </div>
      <div className="text-[8px] sm:text-[10px] uppercase font-bold text-[#6b5c58]/60 tracking-wider sm:tracking-widest break-words w-full">
        {label}
      </div>
      <div className="mt-0.5 sm:mt-1 font-extrabold text-[#2d2624] text-[11px] xs:text-xs sm:text-base break-words whitespace-normal text-wrap w-full">{value}</div>
    </motion.div>
  );
}
