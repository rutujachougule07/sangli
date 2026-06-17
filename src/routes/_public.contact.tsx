import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ORG } from "@/lib/site-data";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { saveInquiry } from "@/lib/firebase-utils";
import { FAQS } from "@/lib/site-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${ORG.short}` },
      {
        name: "description",
        content: "Reach Bhagini Nivedita Pratishthan, Sangli — phone, address and contact form.",
      },
      { property: "og:title", content: `Contact — ${ORG.short}` },
      { property: "og:description", content: "Get in touch with the BNP team." },
    ],
  }),
  component: ContactPage,
});

import { useLanguage } from "@/hooks/use-language";

function ContactPage() {
  const { language, t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 md:pt-40 pb-12">

      <SectionHeading
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        {/* Info + map */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start max-w-[450px] mx-auto w-full">
            <h3 className="font-display text-3xl font-black text-[#2d2624] tracking-tight w-full">{t("contact.formTitle")}</h3>
            <p className="text-lg font-medium text-[#5c524f] leading-relaxed w-full">
              {language === "mr" ? "आम्हाला संपर्क करण्यासाठी खालील माहिती वापरा किंवा आमच्या कार्यालयाला भेट द्या." : "Use the information below to reach out to us or visit our office in person."}
            </p>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 grid-cols-1 max-w-[450px] mx-auto w-full"
          >
            <Item icon={<Phone className="size-6" />} label={t("contact.phone")} value={ORG.phone} href={`tel:${ORG.phone}`} />
            <Item icon={<Mail className="size-6" />} label={t("contact.email")} value={ORG.email} href={`mailto:${ORG.email}`} />
            <Item icon={<Clock className="size-6" />} label={language === "mr" ? "कार्यालयीन वेळ" : "Office Hours"} value={language === "mr" ? "सकाळी १०:०० ते संध्याकाळी ६:००" : "10:00 AM - 06:00 PM"} />
            <Item icon={<MapPin className="size-6" />} label={t("contact.visit")} value={t("contact.address")} href="https://maps.app.goo.gl/kVsRy8rTkx2Bw9rs8?g_st=aw" />
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-8 lg:pt-[150px]"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 border border-white shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
            <iframe
              title="BNP Sangli location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.232363162399!2d74.56396901131448!3d16.858103184646733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1193dd7839ce1%3A0x89c49cf4e4f7396e!2sBhagini%20Nivedita%20Pratishthan%2C%20sangli!5e0!3m2!1sen!2sin!4v1715252500000!5m2!1sen!2sin"
              className="w-full h-[400px] sm:h-[500px] rounded-[1.5rem] sm:rounded-[2.5rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-10 left-10 right-10 flex justify-center pointer-events-none">
              <Button
                asChild
                className="pointer-events-auto rounded-2xl h-14 px-8 bg-white text-primary hover:bg-primary hover:text-white font-black text-sm shadow-2xl transition-all duration-500 scale-100 hover:scale-105"
              >
                <a
                  href="https://maps.app.goo.gl/kVsRy8rTkx2Bw9rs8?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <MapPin className="size-5" /> {t("contact.getDirections")}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#2d2624] mb-4">{t("contact.faqTitle")}</h2>
          <p className="text-[#5c524f] font-medium">{t("contact.faqSubtitle")}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white px-8 py-2 shadow-sm hover:shadow-md transition-all group/faq overflow-hidden"
              >
                <AccordionTrigger className="text-lg font-black text-[#2d2624] hover:text-primary hover:no-underline transition-colors">
                  {t(`faq.q${i + 1}`) || faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#5c524f] font-semibold text-base leading-relaxed pb-6">
                  {t(`faq.a${i + 1}`) || faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

function Item({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="relative flex items-center gap-4 z-10">
        <div className="size-12 rounded-full bg-rose-50 text-primary flex items-center justify-center shrink-0 border shadow-md border-rose-100/50 transform group-hover:rotate-12 transition-transform duration-500">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 mb-0.5">{label}</div>
          <div className="text-[15px] font-black text-[#2d2624] group-hover:text-primary transition-colors leading-tight">{value}</div>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 }
        }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative bg-[#fdfbf7]/80 rounded-[1.2rem] sm:rounded-[1.5rem] p-4 sm:p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center cursor-pointer block"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-[#fdfbf7]/80 rounded-[1.2rem] sm:rounded-[1.5rem] p-4 sm:p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center"
    >
      {content}
    </motion.div>
  );
}
