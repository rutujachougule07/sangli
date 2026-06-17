import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, ImageIcon, Users, TrendingUp, Star, Heart, HandHeart, Mail } from "lucide-react";
import { COURSES, TEAM } from "@/lib/site-data";
import {
  getCourses,
  getGalleryItems,
  getTeam,
  getInquiries,
  getReviews,
  getDonations,
  getVolunteers,
} from "@/lib/firebase-utils";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

export const Route = createFileRoute("/admin/_layout/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({
    courses: COURSES.length,
    gallery: 0,
    team: TEAM.length,
    messages: 0,
    reviews: 0,
    donors: 0,
    volunteers: 0,
  });

  useEffect(() => {
    const unsubs = [
      getCourses((d) => setCounts((s) => ({ ...s, courses: d.length || COURSES.length }))),
      getGalleryItems((d) => setCounts((s) => ({ ...s, gallery: d.length }))),
      getTeam((d) => setCounts((s) => ({ ...s, team: d.length || TEAM.length }))),
      getInquiries((d) => setCounts((s) => ({ ...s, messages: d.length }))),
      getReviews((d) => setCounts((s) => ({ ...s, reviews: d.length }))),
      getDonations((d) => setCounts((s) => ({ ...s, donors: d.length }))),
      getVolunteers((d) => setCounts((s) => ({ ...s, volunteers: d.length }))),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const cards = [
    {
      label: "Courses",
      value: counts.courses,
      icon: GraduationCap,
      color: "from-blue-600 to-cyan-500",
      bgLight: "bg-blue-50/50",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Donors",
      value: counts.donors,
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      bgLight: "bg-rose-50/50",
      shadow: "shadow-rose-500/20",
    },
    {
      label: "Volunteers",
      value: counts.volunteers,
      icon: HandHeart,
      color: "from-indigo-500 to-violet-400",
      bgLight: "bg-indigo-50/50",
      shadow: "shadow-indigo-500/20",
    },
    {
      label: "Team Members",
      value: counts.team,
      icon: Users,
      color: "from-fuchsia-600 to-purple-500",
      bgLight: "bg-fuchsia-50/50",
      shadow: "shadow-fuchsia-500/20",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative space-y-10 min-h-[600px] p-4 lg:p-8 rounded-[3rem] bg-slate-50/30 overflow-hidden backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50">
      {/* Decorative Ambient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute -top-32 -right-32 size-[500px] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse [animation-duration:4s]" />
      <div className="absolute top-1/2 -left-32 size-[400px] bg-gradient-to-tr from-secondary/20 to-blue-500/20 rounded-full blur-[80px] -z-10 animate-pulse [animation-duration:5s]" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm mb-6 backdrop-blur-md">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Live Overview</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 tracking-tight">
            Dashboard <span className="inline-block animate-bounce [animation-duration:2s] text-slate-900">✨</span>
          </h2>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-xl leading-relaxed">
            Here's a beautiful snapshot of what's happening across your <span className="text-primary font-bold">BNP</span> platform right now.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10"
      >
        {cards.map((c) => (
          <motion.div
            key={c.label}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative overflow-hidden p-6 md:p-8 rounded-[2.5rem] bg-white border border-white shadow-xl ${c.shadow} transition-all duration-300`}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

            {/* Animated background gradient on hover */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${c.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

            <div className="relative z-20 flex items-start justify-between">
              <div className={`size-16 rounded-[1.25rem] flex items-center justify-center bg-gradient-to-br ${c.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <c.icon className="size-8 drop-shadow-sm" />
              </div>
              <div className={`flex items-center justify-center size-8 rounded-full ${c.bgLight} group-hover:bg-white transition-colors duration-300`}>
                <TrendingUp className={`size-4 text-slate-400 group-hover:text-slate-800 transition-colors duration-300`} />
              </div>
            </div>

            <div className="relative z-20 mt-8 space-y-2">
              <div className="text-5xl font-display font-black text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {c.value}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                {c.label}
                <div className={`h-[2px] w-0 group-hover:w-8 bg-gradient-to-r ${c.color} transition-all duration-500 rounded-full`} />
              </div>
            </div>

            {/* Decorative corner shape */}
            <div className={`absolute -bottom-8 -right-8 size-32 bg-gradient-to-tl ${c.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
