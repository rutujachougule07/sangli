import { motion } from "framer-motion";
import { ORG } from "@/lib/site-data";
import { useLanguage } from "@/hooks/use-language";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 175.216 175.552"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White background speech bubble */}
      <path
        fill="#ffffff"
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
      />
      {/* Green speech bubble */}
      <path
        fill="#25D366"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      {/* White phone receiver */}
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
      />
    </svg>
  );
}

export function WhatsAppButton() {
  const { language } = useLanguage();

  const whatsappUrl = `https://wa.me/91${ORG.phone}?text=${encodeURIComponent(
    language === "mr" 
      ? "नमस्ते, मला भगिनी निवेदिता प्रतिष्ठानच्या उपक्रमांबद्दल अधिक माहिती हवी आहे." 
      : "Namaste, I would like to know more about Bhagini Nivedita Pratishthan's initiatives."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Main Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-2 bg-[#25D366]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Button Body (original icon including tail) */}
        <div className="relative size-14 sm:size-16 flex items-center justify-center filter drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300">
          <WhatsAppIcon className="size-full" />
        </div>

        {/* Online Indicator */}
        <div className="absolute top-0 right-0 size-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="size-2.5 bg-[#25D366] rounded-full animate-pulse" />
        </div>
      </motion.a>
    </div>
  );
}
