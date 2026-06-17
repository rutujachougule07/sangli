import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ORG } from "@/lib/site-data";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/bnp-logo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { toast } from "sonner";

export const Route = createFileRoute("/receipt")({
  component: ReceiptPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      n: (search.n as string) || "Valued Donor",
      a: (search.a as string) || "0",
      p: (search.p as string) || "",
      ad: (search.ad as string) || "",
    };
  },
});

function ReceiptPage() {
  const { n: name, a: amount, p: pan, ad: aadhaar } = Route.useSearch();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const date = new Date().toLocaleDateString('mr-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const receiptNo = `BNP-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    const toastId = toast.loading("तुमची पावती तयार होत आहे...");

    try {
      // Temporary style cleanup for better capture
      const originalStyle = receiptRef.current.style.boxShadow;
      receiptRef.current.style.boxShadow = "none";
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      receiptRef.current.style.boxShadow = originalStyle;

      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`BNP_Receipt_${receiptNo}.pdf`);
      toast.success("पावती यशस्वीरित्या डाउनलोड झाली!", { id: toastId });
    } catch (error: any) {
      console.error("Download Error:", error);
      toast.error(`डाउनलोड अयशस्वी: ${error.message || 'कृपया पुन्हा प्रयत्न करा'}`, { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  // --- Auto-Download Logic ---
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDownload();
    }, 1500); // 1.5s delay to ensure everything is rendered
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-2 xs:p-4 sm:p-8 font-sans">
      {/* Receipt Card */}
      <div
        ref={receiptRef}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div id="receipt-header" className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-5 xs:p-8 sm:p-12 text-white relative overflow-hidden border-b-4 border-amber-400/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/20 rounded-full -ml-20 -mb-20 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-3 xs:gap-5">
              <div className="size-14 xs:size-20 rounded-xl xs:rounded-2xl bg-white p-1.5 xs:p-2 flex items-center justify-center shadow-2xl border border-slate-100 ring-4 ring-white/20 shrink-0">
                <img src={logo} alt="BNP Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg xs:text-2xl sm:text-3xl font-black tracking-tight leading-tight">{ORG.name_mr || 'भगिनी निवेदिता प्रतिष्ठान'}</h1>
                <p className="text-xs sm:text-sm text-amber-100 font-bold tracking-widest uppercase mt-1">अधिकृत देणगी पावती</p>
              </div>
            </div>
            <div className="text-left sm:text-right pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">पावती क्रमांक</p>
              <p className="text-lg sm:text-xl font-bold tracking-tighter text-amber-300">#{receiptNo}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 xs:p-8 sm:p-12 space-y-10 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <img src={logo} alt="" className="w-96 h-96 object-contain grayscale" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
            <div className="space-y-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">देणगीदार</p>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{name}</h2>
              </div>
              {(pan || aadhaar) && (
                <div className="text-xs text-slate-500 font-semibold space-y-1 mt-1">
                  {pan && <p>पॅन क्रमांक (PAN): <span className="font-mono text-slate-800 uppercase">{pan}</span></p>}
                  {aadhaar && <p>आधार क्रमांक (Aadhaar): <span className="font-mono text-slate-800">{aadhaar}</span></p>}
                </div>
              )}
            </div>
            <div className="space-y-1 text-left sm:text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">दिनांक</p>
              <p className="text-lg font-bold text-slate-900">{date}</p>
            </div>
          </div>

          <div className="py-10 border-y border-primary/10 flex flex-col items-center text-center bg-primary/5 rounded-3xl relative z-10">
            <p className="text-sm font-bold text-primary/70 mb-2 uppercase tracking-widest">प्राप्त रक्कम</p>
            <div className="text-4xl xs:text-5xl sm:text-6xl font-black text-primary tracking-tighter drop-shadow-sm">
              ₹{Number(amount).toLocaleString('en-IN')}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 bg-amber-100/50 text-amber-700 px-4 py-2 rounded-full border border-amber-200/50">
              <ShieldCheck className="size-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">विना-परतावा धर्मादाय देणगी</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 pt-4 relative z-10">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">संस्थेचा तपशील</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                भगिनी निवेदिता प्रतिष्ठान<br />
                सांगली, महाराष्ट्र - ४१६४१६<br />
                नोंदणी क्रमांक: एफ-१२३४ (सांगली)
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-sm">
                <ShieldCheck className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">८०जी प्रमाणित</span>
              </div>
              <div className="text-center mt-4">
                <div className="w-40 h-12 border-b-2 border-slate-300 mb-2 relative">
                  <div className="absolute -bottom-2 right-4 text-slate-300 rotate-[-15deg] font-signature text-3xl">BNP</div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">अधिकृत स्वाक्षरी</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-primary/5 p-6 text-center border-t border-primary/10">
          <p className="text-sm font-semibold text-primary/80 italic">
            "तुमची आजची मदत कोणाच्या तरी उद्यासाठी प्रकाशाचा किरण बनेल."
          </p>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] print:hidden">
        भगिनी निवेदिता प्रतिष्ठान • अधिकृत पावती प्रणाली
      </p>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .min-h-screen { min-height: unset !important; padding: 0 !important; }
          .bg-slate-50 { background-color: white !important; }
          .shadow-2xl { box-shadow: none !important; }
          .rounded-3xl { border-radius: 0 !important; }
          h1, h2, h4, p, span, div { color: black !important; }
          #receipt-header { background-color: white !important; border-bottom: 2px solid black !important; }
          .text-amber-100, .text-amber-300, .text-white { color: black !important; }
          .w-full.max-w-2xl { width: 100% !important; max-width: none !important; margin: 0 !important; border: none !important; }
          @page { margin: 0; size: auto; }
          body { margin: 1cm; }
        }
      `}} />
    </div>
  );
}
