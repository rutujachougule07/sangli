import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Sparkles, X, ZoomIn, Play, Film, Info, Smile, Shield, Home, MessageSquare, Users, Clock, GraduationCap, HeartHandshake, HandHeart, Briefcase, Newspaper, ExternalLink } from "lucide-react";
import { NEWS, ORG } from "@/lib/site-data";
import { listGalleryFiles, getGalleryItems } from "@/lib/firebase-utils";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

// Extract YouTube video ID from any YouTube URL
function getYouTubeId(url: string): string | null {
  const regExp =
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return /youtube\.com|youtu\.be/.test(url);
}

function isLocalVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)($|\?)/i.test(url) || url.includes("/videos%2F");
}

function NewsCardImage({ src, title, priority }: { src?: string; title?: string; priority?: boolean }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
          <Newspaper className="size-8 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
          News Link
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setError(true)}
      className="size-full object-contain group-hover:scale-105 transition-transform duration-700"
    />
  );
}

function LightboxImage({ src, title }: { src?: string; title?: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-[320px] h-[240px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex flex-col items-center justify-center p-6 text-center rounded-[1.5rem] border border-slate-200/50 bg-white shadow-lg">
        <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
          <Newspaper className="size-8 text-primary/40" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
          Image Not Available
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      onError={() => setError(true)}
      className="max-h-[40vh] md:max-h-[70vh] max-w-full w-auto object-contain rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-200/50 bg-white"
    />
  );
}

const ONGOING_ACTIVITIES = [
  {
    id: "act1",
    icon: Smile,
    title: "Balasadan",
    title_mr: "बालसदन",
    desc: "Balasadan for orphan or single parent girls at Yashwantnagar Sangli .The girls live there till they are 18 years old.",
    desc_mr: "यशवंतनगर, सांगली येथे अनाथ किंवा एकाच पालकाच्या मुलींसाठी बालसदन. मुली १८ वर्षांच्या होईपर्यंत येथे राहतात.",
    bg: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    id: "act2",
    icon: Shield,
    title: "Balagruha",
    title_mr: "बालगृह",
    desc: "Balagruha for Positive girls till the age of 18.",
    desc_mr: "पॉझिटिव्ह मुलींसाठी १८ वर्षांपर्यंतचे सुरक्षित बालगृह.",
    bg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    id: "act3",
    icon: Home,
    title: "Working Women's Hostel",
    title_mr: "नोकरी करणाऱ्या महिलांचे वसतिगृह",
    desc: "Safe and affordable Working Women's Hostel at Sangli & Nagpur.",
    desc_mr: "सांगली आणि नागपूर येथे नोकरी करणाऱ्या महिलांसाठी सुरक्षित आणि परवडणारे वसतिगृह.",
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: "act4",
    icon: MessageSquare,
    title: "Counseling Center (Special Cell)",
    title_mr: "सल्लागार केंद्र (विशेष कक्ष)",
    desc: "Counseling Center (Special Cell) for women and children.",
    desc_mr: "महिला आणि मुलांच्या समस्यांसाठी सल्लागार केंद्र आणि विशेष कक्ष.",
    bg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "act5",
    icon: Users,
    title: "Family Counseling Center",
    title_mr: "कौटुंबिक सल्ला केंद्र",
    desc: "Family Counseling Center at Rajwada, Sangli, resolving disputes and supporting families.",
    desc_mr: "राजवाडा, सांगली येथील कौटुंबिक सल्ला केंद्र, जे कौटुंबिक वाद सोडविण्यास मदत करते.",
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    id: "act6",
    icon: Clock,
    title: "Shakti Sadan",
    title_mr: "शक्ती सदन",
    desc: "Shakti Sadan at Yashwantnagar, Sangli, for women in distress.",
    desc_mr: "संकटात सापडलेल्या महिलांसाठी यशवंतनगर, सांगली येथे शक्ती सदन.",
    bg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "act7",
    icon: GraduationCap,
    title: "Vocational Training Center",
    title_mr: "व्यावसायिक प्रशिक्षण केंद्र",
    desc: "Vocational Training Center at Yashwantnagar and Rajwada, offering skill programs.",
    desc_mr: "यशवंतनगर आणि राजवाडा येथील व्यावसायिक प्रशिक्षण केंद्र, जिथे महिलांना स्वावलंबी बनवणारे कोर्सेस शिकवले जातात.",
    bg: "bg-pink-50 text-pink-600 border-pink-100",
  },
  {
    id: "act8",
    icon: Home,
    title: "Kamaltai Jog Vasatigruha, Jath",
    title_mr: "कमलताई जोग वसतिगृह, जत",
    desc: "A safe hostel for girl students above 18 years.",
    desc_mr: "१८ वर्षांवरील विद्यार्थिनींसाठी सुरक्षित वसतिगृह.",
    bg: "bg-teal-50 text-teal-600 border-teal-100",
  },
];

export const Route = createFileRoute("/_public/news")({
  head: () => ({
    meta: [
      { title: `News & Activities — ${ORG.short}` },
      {
        name: "description",
        content: "Latest news and ongoing activities at Bhagini Nivedita Pratishthan, Sangli.",
      },
      { property: "og:title", content: `News & Activities — ${ORG.short}` },
      { property: "og:description", content: "Stories from our work across Sangli." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"activities" | "gallery">("activities");
  const [lightbox, setLightbox] = useState<{ src: string; title: string; videoUrl?: string | null } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

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

  const [storageItems, setStorageItems] = useState<any[]>([]);
  const [firestoreItems, setFirestoreItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Storage
  useEffect(() => {
    setIsLoading(true);
    listGalleryFiles().then((files) => {
      setStorageItems(files);
      setIsLoading(false);
    }).catch((e) => {
      console.error(e);
      setIsLoading(false);
    });
  }, []);

  // Load from Firestore (old images)
  useEffect(() => {
    const unsubscribe = getGalleryItems((data) => {
      setFirestoreItems(data);
    });
    return () => unsubscribe();
  }, []);

  const items = useMemo(() => {
    const mappedStorage = storageItems.map((it: any) => ({
      id: it.fullPath || it.name,
      title: it.customTitle || '',
      title_mr: it.customTitle_mr || '',
      image: it.url,
      isVideo: it.isVideo || false,
      videoUrl: it.isVideo ? it.url : null,
      source: 'storage',
      name: it.name,
    }));

    const mappedFirestore = firestoreItems.map((it) => ({
      id: it.id,
      image: it.url,
      videoUrl: (it.isVideo || isYouTubeUrl(it.url) || isLocalVideoUrl(it.url)) ? it.url : null,
      isVideo: !!it.isVideo || isYouTubeUrl(it.url) || isLocalVideoUrl(it.url),
      isYouTube: isYouTubeUrl(it.url),
      title: it.title || '',
      title_mr: it.title_mr || '',
      source: 'firestore',
      name: it.title || '',
      newsLink: it.newsLink || null,
    }));

    // Both storageItems and firestoreItems are already fetched in descending order (newest first).
    const merged = [...mappedStorage, ...mappedFirestore];

    // Custom sorting to pin specific 3 items at the top
    return merged.sort((a, b) => {
      const getRank = (item: any) => {
        const title = (item.title || "").toLowerCase();
        const titleMr = (item.title_mr || "").toLowerCase();

        const nameStr = (item.name || "").toLowerCase();
        const idStr = (item.id || "").toLowerCase();

        const matches = (str: string) => title.includes(str) || titleMr.includes(str) || nameStr.includes(str) || idStr.includes(str);

        // --- EXPLICIT TOP PINNED ITEMS (Always check these first!) ---
        // Rank 1: Nivedita Bhawan
        if (matches("nivedita bhawan") || matches("निवेदिता भवन") || matches("working women's hostel")) return 1;

        // Rank 2 and 3: Chief Minister photos
        if (matches("chief minister") || matches("birthday") || matches("orphan") || matches("मुख्यमंत्र") || matches("वाढदिवस") || matches("अनाथ") || matches("fadnavis") || matches("devendra") || matches("फिडे") || matches("अंधाराचे")) return 2;

        // Rank 4: Seva Gatha
        if (matches("seva gatha") || matches("सेवा गाथा") || matches("published from rajasthan")) return 4;

        // Rank 5: Invitation Card
        if (matches("invitation") || matches("founder of the organization") || idStr.includes("sukanya_sammelan_invitation") || nameStr.includes("invitation")) return 5;
        // -------------------------------------------------------------

        // Check highly specific images first to avoid collisions
        // Rank 6 (Rangoli)
        if (matches("rangoli") || matches("रांगोळी")) return 6;

        // Rank 5 (Kusumgandh release)
        if (matches("kusumgandh") || matches("कुसुमगंध") || matches("souvenir") || matches("स्मरणिका") || matches("releasing") || matches("प्रकाशन")) return 6;

        // Rank 6 (75 Sukanyas honored)
        if (matches("75") || matches("७५") || matches("honored") || matches("सत्कार") || matches("tribute") || matches("55th anniversary")) return 7;

        // Rank 7 (Executive Team)
        if (matches("sanstha_group_photo") || matches("grateful") || matches("executive team") || matches("samelan.. executive team") || matches("कृतज्ञता") || matches("कार्यकारिणी") || matches("अतिथी")) return 8;

        // Rank 8 (Citizens & Well-wishers)
        if (matches("citizens") || matches("well-wishers") || matches("gathered") || matches("प्रेक्षक") || matches("नागरिक") || matches("उपस्थित") || matches("audience")) return 9;

        // Rank 9 (Certificate)
        if (matches("honorary certificate") || matches("certificate") || matches("outstandingly") || matches("प्रमाणपत्र") || matches("पुरस्कार") || matches("award") || matches("गौरव") || matches("certificate awarded")) return 11;

        // Rank 10 (Major Mohini Garge Kulkarni)
        if (matches("mohini") || matches("garge") || matches("kulkarni") || matches("opportunities") || matches("army") || matches("मोहिनी") || matches("गर्गे") || matches("कुलकर्णी") || matches("सैन्य")) return 10;

        // Rank 11 (Video)
        if (item.isVideo) return 11;

        // Rank 12 (Newspaper)
        if (matches("newspaper") || matches("newspapers") || matches("note of") || matches("वृत्तपत्र") || matches("बातमी") || matches("पेपर") || matches("लष्कराची वर्दी") || matches("शूरवीर") || matches("hutatma")) return 12;

        // Rank 18 (Annapurna First Batch Demonstration) - Check early to avoid being caught by other 'annapurna' or 'skill' groups
        if (matches("first batch") || matches("imparting") || matches("demonstration") || matches("प्रात्यक्षिक") || matches("पहिली बॅच")) return 18;

        // Rank 13 (Nursing Courses Banner)
        if (matches("courses like nursing") || matches("beauty parlour") || matches("fashion designing") || matches("courses")) return 13;

        // Rank 14 (Girls playing on holiday)
        if (matches("enjoy playing") || matches("holiday") || matches("girls enjoy") || matches("खेळताना") || matches("सुट्टीच्या") || matches("आनंद")) return 14;

        // Rank 15 (Swearing Ceremony VIIIth Batch - Dr. Sharad Patil)
        if (matches("viiith") || matches("sharad patil") || matches("vith batch") || matches("शरद पाटील")) return 15;

        // Group 16: Other Nursing & Skill Development
        if (matches("nursing") || matches("नर्सिंग") || matches("skill") || matches("कौशल्य") || matches("swearing ceremony") || matches("annapurna") || matches("अन्नपूर्णा")) {
          return 16;
        }

        // Group 17: Others
        return 17;
      };

      const rankA = getRank(a);
      const rankB = getRank(b);

      // If ranks are different, sort by rank
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return 0; // maintain original order
    });

    return merged;
  }, [storageItems, firestoreItems]);

  return (
    <div ref={containerRef} className="overflow-hidden relative" style={{ position: 'relative' }}>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 md:pt-40 pb-24">
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading
            eyebrow="Activities & News"
            title={language === "mr" ? "आमचे उपक्रम आणि ताज्या घडामोडी" : "Our Projects & Latest Updates"}
            subtitle={language === "mr" ? "महिला सक्षमीकरण आणि बाल कल्याणासाठी कार्यरत असणारी आमची प्रमुख केंद्रे व बातम्या." : "Explore our permanent welfare centers and latest gallery updates."}
            className="mb-12"
          />
        </motion.div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16">
          <button
            onClick={() => setActiveTab("activities")}
            className={cn(
              "px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 border shadow-sm",
              activeTab === "activities"
                ? "bg-primary text-white border-primary shadow-primary/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            )}
          >
            {language === "mr" ? "कायमस्वरूपी प्रकल्प व केंद्रे" : "Ongoing Projects & Centers"}
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={cn(
              "px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 border shadow-sm",
              activeTab === "gallery"
                ? "bg-primary text-white border-primary shadow-primary/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            )}
          >
            {language === "mr" ? "ताज्या घडामोडी व गॅलरी" : "Recent Updates & Gallery"}
          </button>
        </div>

        {activeTab === "activities" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center sm:place-items-stretch">
            {ONGOING_ACTIVITIES.map((act, i) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group relative p-5 sm:p-8 bg-[#fdfbf7]/80 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_40px_100px_rgba(159,18,57,0.12)] hover:border-rose-100/60 flex flex-col overflow-hidden transition-all duration-500 h-full max-w-[330px] sm:max-w-none w-full"
                >
                  <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />

                  <div className="size-10 sm:size-12 rounded-full bg-rose-50 text-primary flex items-center justify-center border shadow-md border-rose-100/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10 mb-4 sm:mb-6">
                    <Icon className="size-5 sm:size-6" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#2d2624] mb-3 group-hover:text-primary transition-colors relative z-10">
                    {language === "mr" ? act.title_mr : act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b5c58] font-medium leading-relaxed flex-1 relative z-10">
                    {language === "mr" ? act.desc_mr : act.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] max-w-[320px] sm:max-w-[340px] md:max-w-[360px] mx-auto w-full animate-pulse h-[340px] flex flex-col">
                <div className="p-2 sm:p-2.5">
                  <div className="aspect-[5/4] bg-slate-100/80 rounded-[1.5rem]" />
                </div>
                <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 flex flex-col flex-1 justify-center gap-3">
                  <div className="h-3.5 bg-slate-100/80 rounded-full w-3/4 mx-auto" />
                  <div className="h-3.5 bg-slate-100/80 rounded-full w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {items.map((n: any, i: number) => {
              const isVid = n.isVideo;
              const displayTitle = language === "mr" ? (n.title_mr || n.title) : (n.title || n.title_mr);

              return (
                <motion.article
                  key={n.id}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(127,29,29,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col max-w-[320px] sm:max-w-[340px] md:max-w-[360px] mx-auto w-full"
                >
                  <div className={cn("p-2 sm:p-2.5", displayTitle ? "pb-0 sm:pb-0" : "")}>
                    <button
                      onClick={() => {
                        if (n.newsLink && !isVid) {
                          window.open(n.newsLink, "_blank", "noopener,noreferrer");
                        } else {
                          setLightbox({
                            src: n.image,
                            title: displayTitle,
                            videoUrl: isVid ? n.videoUrl : null,
                          });
                        }
                      }}
                      className="block relative aspect-[5/4] overflow-hidden bg-transparent w-full rounded-[1.5rem]"
                    >
                      {isVid ? (
                        <video
                          src={n.image}
                          className="size-full object-contain group-hover:scale-105 transition-transform duration-700"
                          preload={i < 4 ? "auto" : "metadata"}
                          muted
                          playsInline
                        />
                      ) : (
                        <NewsCardImage src={n.image} title={displayTitle} priority={i < 4} />
                      )}

                      {/* Video: play button */}
                      {isVid ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                          <div className="size-11 sm:size-13 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md">
                              {n.newsLink ? (
                                <ExternalLink className="size-4.5 text-primary" />
                              ) : (
                                <ZoomIn className="size-4.5 text-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Video badge */}
                      {isVid && (
                        <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Film className="size-2.5" /> Video
                        </div>
                      )}

                      {/* External Link badge */}
                      {n.newsLink && (
                        <div className="absolute top-2.5 right-2.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <ExternalLink className="size-2.5" /> Link
                        </div>
                      )}
                    </button>
                  </div>

                  {displayTitle && displayTitle.trim() !== '' && (
                    <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 flex flex-col flex-1 justify-center">
                      <h3 className="font-display text-sm sm:text-base font-extrabold leading-snug text-[#2d2624] group-hover:text-primary transition-colors text-center line-clamp-3">
                        {displayTitle}
                      </h3>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
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
                  <LightboxImage src={lightbox.src} title={lightbox.title} />
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
                      <span className="text-slate-700 text-xs font-bold uppercase tracking-widest">{language === "mr" ? "माहिती" : "Information"}</span>
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
    </div>
  );
}
