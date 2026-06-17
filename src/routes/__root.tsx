import {
  Outlet,
  Link,
  createRootRoute,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ORG } from "@/lib/site-data";
import { LanguageProvider, useLanguage } from "@/hooks/use-language";

function ErrorComponent({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf8f7] px-4">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="mb-8 relative group">
           <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
           <Logo size={100} showText={false} />
        </div>
        
        <h1 className="text-4xl font-black text-primary leading-tight">Something went wrong</h1>
        <p className="mt-4 text-base font-medium text-muted-foreground leading-relaxed">
          An unexpected error occurred. Don't worry, our team has been notified.
        </p>

        {error?.message && (
          <div className="mt-6 w-full p-4 rounded-2xl bg-primary/5 border border-primary/10 font-mono text-[11px] text-primary/70 break-words">
             {error.message}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full">
          <Button 
            onClick={() => reset()} 
            className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all border-0"
          >
            <RefreshCcw className="mr-2 size-4" /> Try again
          </Button>
          <Button 
            asChild 
            variant="outline"
            className="w-full h-14 rounded-2xl bg-white border-white font-black text-base shadow-lg shadow-slate-200/50 hover:bg-slate-50 transition-all border-0"
          >
            <Link to="/">
              <Home className="mr-2 size-4" /> Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { language } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />
      <Outlet />
      <Toaster />
    </>
  );
}

