import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, HandHeart, Check, Copy, Loader2, PartyPopper, X, MailCheck, FileText, Landmark, QrCode, ShieldCheck, Phone, Mail } from "lucide-react";
import { ORG } from "@/lib/site-data";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveDonation, saveVolunteer } from "@/lib/firebase-utils";
import { sendThankYouEmail, sendVolunteerEmail, sendAdminAlertEmail, sendAdminDonationAlertEmail } from "@/lib/email-utils";
import { generateReceiptPDF } from "@/lib/receipt-utils";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_public/contribute")({
  head: () => ({
    meta: [
      { title: `Contribute — ${ORG.short}` },
      {
        name: "description",
        content: "Donate or volunteer with Bhagini Nivedita Pratishthan, Sangli.",
      },
      { property: "og:title", content: `Contribute — ${ORG.short}` },
      { property: "og:description", content: "Support our cause through donations or your time." },
    ],
  }),
  component: ContributePage,
});

const AMOUNTS = [500, 1000, 2500, 5000, 10000];

function ContributePage() {
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState<number>(1000);
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [vLoading, setVLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [donor, setDonor] = useState({ name: "", email: "", phone: "", aadhaar: "", pan: "", address: "" });
  const [lastDonation, setLastDonation] = useState<{ name: string; email: string; phone: string; amount: number; aadhaar?: string; pan?: string; address?: string } | null>(null);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("bnpsangli@sbi");
    setCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };


  const [pendingDonation, setPendingDonation] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount;
    if (!finalAmount || finalAmount <= 0) return toast.error("Please enter a valid amount");

    // Format Validation
    if (!donor.aadhaar || donor.aadhaar.length !== 12) {
      return toast.error(language === "mr" ? "कृपया वैध १२-अंकी आधार क्रमांक टाका." : "Please enter a valid 12-digit Aadhaar number.");
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!donor.pan || !panRegex.test(donor.pan)) {
      return toast.error(language === "mr" ? "कृपया वैध पॅन कार्ड क्रमांक टाका." : "Please enter a valid PAN card number (e.g. ABCDE1234F).");
    }

    setShowQRModal(true);
    setPendingDonation(true);
  };

  const processDonation = async () => {
    const finalAmount = amount;
    setLoading(true);
    try {
      const donationData = {
        amount: finalAmount,
        utr: utr,
        ...donor
      };
      await saveDonation(donationData);
      setLastDonation(donationData);

      // Admin Alert Email
      sendAdminDonationAlertEmail({
        d_name: donor.name,
        d_email: donor.email,
        d_phone: donor.phone,
        d_amount: finalAmount,
        d_utr: utr,
        lang: language
      }).catch(err => console.error("Admin donation alert failed:", err));

      // Attempt to send automated email
      toast.promise(
        sendThankYouEmail({
          to_name: donor.name,
          to_email: donor.email,
          amount: finalAmount,
          phone: donor.phone,
          lang: language,
          aadhaar: donor.aadhaar,
          pan: donor.pan
        }),
        {
          loading: 'Sending thank-you email...',
          success: 'Email sent to donor successfully!',
          error: (err) => `Donor Email Failed: ${err.text || JSON.stringify(err)}`,
        }
      );

      setShowQRModal(false);
      setPendingDonation(false);
      toast.success(language === "mr" ? "तुमची देणगी यशस्वीरित्या नोंदवली गेली आहे! धन्यवाद." : "Your donation has been recorded successfully! Thank you.");
      setDonor({ name: "", email: "", phone: "", aadhaar: "", pan: "", address: "" });
      setUtr("");
    } catch (error: any) {
      console.error("Firebase Donation Error:", error);
      toast.error(`Failed to record donation: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const vName = formData.get("v-name") as string;
    const vEmail = formData.get("v-email") as string;
    const vPhone = formData.get("v-phone") as string;
    const vSkill = formData.get("v-skill") as string;

    setVLoading(true);
    try {
      await saveVolunteer({ name: vName, email: vEmail, phone: vPhone, skill: vSkill });

      // 1. Send Alert Email to Admin (You)
      toast.promise(
        sendAdminAlertEmail({
          v_name: vName,
          v_email: vEmail,
          v_phone: vPhone,
          v_skill: vSkill,
          lang: language
        }),
        {
          loading: 'Processing application...',
          success: 'Your application has been received!',
          error: (err) => `Admin Alert Failed: ${err.text || JSON.stringify(err)}`,
        }
      );

      // 2. Send Automatic Welcome/Acknowledgement to Volunteer
      sendVolunteerEmail({
        to_name: vName,
        to_email: vEmail,
        lang: language
      }).catch(err => console.error("Auto-welcome failed:", err));

      toast.success(language === "mr" ? "तुमचा अर्ज यशस्वीरित्या सबमिट झाला आहे! धन्यवाद." : "Your application has been submitted successfully! Thank you.");
      form.reset();
    } catch (error: any) {
      console.error("Firebase Save Error:", error);
      toast.error(`Failed to save application: ${error.message || 'Unknown error'}`);
    } finally {
      setVLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 sm:pt-36 md:pt-40 pb-20">
      <SectionHeading
        title={t("contribute.title")}
        subtitle={t("contribute.subtitle")}
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {/* Donate */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3.5rem] p-5 xs:p-8 sm:p-12 border border-white shadow-2xl shadow-[#312723]/10 max-w-xl mx-auto lg:max-w-none w-full"
        >
          <div className="flex items-center gap-5">
            <div className="size-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Heart className="size-8 drop-shadow-md" />
            </div>
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-[#2d2624]">{t("contribute.donateTitle")}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t("contribute.donateSub")}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-xs font-bold text-[#6b5c58] flex flex-wrap items-center gap-2">
            <span>{t("contribute.forDonations")}</span>
            <a href={`tel:${ORG.phone}`} className="hover:underline text-primary">{ORG.phone}</a>
            <span className="text-[#ece1de]">|</span>
            <a href={`mailto:${ORG.email}`} className="hover:underline text-primary">{ORG.email}</a>
          </div>

          <form onSubmit={handleDonate} className="mt-10 space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.selectAmount")}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMOUNTS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => {
                      setAmount(a);
                    }}
                    className={cn(
                      "py-4 rounded-2xl text-[15px] font-black transition-all duration-300 border-2",
                      amount === a
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-white/50 border-[#ece1de]/50 text-[#6b5c58]/80 hover:border-primary/30"
                    )}
                  >
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#ece1de]/30">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.donorDetails")}</Label>
              <div className="space-y-4">
                <Input
                  required
                  placeholder={t("contribute.fullName")}
                  className="h-14 rounded-2xl bg-white/50 border-slate-100"
                  value={donor.name}
                  onChange={e => setDonor(s => ({ ...s, name: e.target.value }))}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    required
                    type="email"
                    placeholder={t("contribute.email")}
                    className="h-14 rounded-2xl bg-white/50 border-slate-100"
                    value={donor.email}
                    onChange={e => setDonor(s => ({ ...s, email: e.target.value }))}
                  />
                  <Input
                    required
                    placeholder={t("contribute.phone")}
                    className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50"
                    value={donor.phone}
                    onChange={e => setDonor(s => ({ ...s, phone: e.target.value }))}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    required
                    type="text"
                    maxLength={12}
                    pattern="\d*"
                    placeholder={t("contribute.aadhaar")}
                    className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50"
                    value={donor.aadhaar}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      setDonor(s => ({ ...s, aadhaar: val }));
                    }}
                  />
                  <Input
                    required
                    type="text"
                    maxLength={10}
                    placeholder={t("contribute.pan")}
                    className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50 uppercase"
                    value={donor.pan}
                    onChange={e => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                      setDonor(s => ({ ...s, pan: val }));
                    }}
                  />
                </div>
                <Input
                  required
                  placeholder={t("contribute.address")}
                  className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50"
                  value={donor.address}
                  onChange={e => setDonor(s => ({ ...s, address: e.target.value }))}
                />
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              size="lg"
              className="h-16 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98] border-0"
            >
              {loading ? <Loader2 className="size-6 animate-spin" /> : `${t("contribute.donateButton")} ₹${amount.toLocaleString()}`}
            </Button>
          </form>

          <div className="mt-10 p-6 rounded-[2rem] bg-amber-50/20 border border-[#ece1de]/50">
            <ul className="space-y-4">
              {[
                t("contribute.benefit1"),
                t("contribute.benefit2"),
                t("contribute.benefit3"),
              ].map((text) => (
                <li key={text} className="flex gap-3 items-center text-sm font-bold text-muted-foreground/80">
                  <div className="size-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Volunteer & Scanner Column */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3.5rem] p-5 xs:p-8 sm:p-12 border border-white shadow-2xl shadow-[#312723]/10 h-fit max-w-xl mx-auto lg:max-w-none w-full"
          >
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-[1.5rem] bg-gradient-to-br from-secondary to-secondary/80 text-white flex items-center justify-center shadow-lg shadow-secondary/20">
                <HandHeart className="size-8 drop-shadow-md" />
              </div>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-[#2d2624]">{t("contribute.volunteerTitle")}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">{t("contribute.volunteerSub")}</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 text-xs font-bold text-[#6b5c58] flex flex-wrap items-center gap-2">
              <span>{t("contribute.forVoluntary")}</span>
              <a href={`tel:${ORG.phone}`} className="hover:underline text-secondary">{ORG.phone}</a>
              <span className="text-[#ece1de]">|</span>
              <a href={`mailto:${ORG.email}`} className="hover:underline text-secondary">{ORG.email}</a>
            </div>

            <form className="mt-12 space-y-6" onSubmit={handleVolunteer}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="v-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.vName")}</Label>
                  <Input id="v-name" name="v-name" required className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50" placeholder={t("contribute.fullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="v-phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.vPhone")}</Label>
                  <Input id="v-phone" name="v-phone" required className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50" placeholder="+91..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.vEmail")}</Label>
                <Input id="v-email" name="v-email" type="email" required className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50" placeholder="email@address.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-skill" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t("contribute.vHelp")}</Label>
                <Input
                  id="v-skill"
                  name="v-skill"
                  required
                  placeholder={t("contribute.vHelpPlaceholder")}
                  className="h-14 rounded-2xl bg-white/50 border-[#ece1de]/50"
                />
              </div>
              <Button disabled={vLoading} type="submit" size="lg" className="h-16 w-full rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-xl shadow-secondary/20 transition-all hover:shadow-secondary/30 active:scale-[0.98] border-0">
                {vLoading ? <Loader2 className="size-6 animate-spin" /> : t("contribute.vButton")}
              </Button>
            </form>
          </motion.div>


        </div>
      </div>




      {/* QR Code Zoom Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowQRModal(false);
                setPendingDonation(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] xs:rounded-[3rem] p-5 xs:p-8 text-center shadow-2xl overflow-hidden border border-white"
            >
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setPendingDonation(false);
                }}
                className="absolute top-4 right-4 xs:top-6 xs:right-6 p-2 rounded-full hover:bg-amber-50 transition-all text-[#6b5c58]/20 hover:text-primary z-10"
              >
                <X className="size-5" />
              </button>

              <div className="flex flex-col items-center">
                {!pendingDonation && (
                  <span className="text-xs xs:text-sm font-black uppercase tracking-[0.2em] text-[#6b5c58]/80 mb-4">{t("contribute.scanTitle")}</span>
                )}
                
                <div className="w-[80%] max-w-[250px] aspect-square rounded-2xl overflow-hidden border-2 border-primary/10 bg-white mb-4 p-2 xs:p-4 shadow-inner mx-auto">
                  <img
                    src="/sbi-qr-code.png"
                    alt="SBI UPI Scan & Pay"
                    className="w-full h-full object-contain"
                  />
                </div>

                {!pendingDonation && (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">{t("contribute.upiLabel")}</span>
                    <div className="flex items-center gap-2 bg-[#fdfaf9] border border-[#ece1de]/60 rounded-2xl px-3 xs:px-5 py-2 xs:py-3 shadow-inner">
                      <span className="text-sm xs:text-base sm:text-lg font-black text-[#2d2624] tracking-tight select-all">bnpsangli@sbi</span>
                      <button
                        onClick={handleCopyUPI}
                        type="button"
                        className="p-1.5 hover:bg-[#ece1de]/40 rounded-lg text-primary transition-colors"
                        title="Copy UPI ID"
                      >
                        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </>
                )}
                
                {pendingDonation && (
                  <div className="mt-2 w-full">
                     <div className="bg-amber-50 border border-amber-100 rounded-2xl py-3 px-4 mb-4">
                       <p className="text-sm font-bold text-slate-700">
                         {language === "mr" ? `कृपया ₹${amount.toLocaleString()} स्कॅन करून पे करा` : `Please scan and pay ₹${amount.toLocaleString()}`}
                       </p>
                       <div className="flex items-center justify-center gap-2 mt-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">UPI ID:</span>
                         <span className="text-xs font-bold text-slate-600 select-all">bnpsangli@sbi</span>
                       </div>
                     </div>

                     <div className="mb-4 text-left">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                         {language === "mr" ? "१२ अंकी UTR / Transaction ID" : "12-Digit UTR / Transaction ID"}
                       </Label>
                       <Input
                         required
                         type="text"
                         maxLength={12}
                         placeholder="उदा. 123456789012"
                         className="h-14 mt-1 rounded-2xl bg-[#fdfaf9] border-[#ece1de]/60"
                         value={utr}
                         onChange={e => setUtr(e.target.value.replace(/\D/g, ""))}
                       />
                     </div>

                     <Button 
                       onClick={processDonation}
                       disabled={loading || utr.length !== 12}
                       className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-95 transition-all border-0"
                     >
                       {loading ? <Loader2 className="size-5 animate-spin mr-2" /> : <Check className="size-5 mr-2" />}
                       {language === "mr" ? "मी पेमेंट केले आहे" : "Payment Completed"}
                     </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
