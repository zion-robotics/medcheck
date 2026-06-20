import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Search, Camera, MapPin, Info, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/search", label: "Search", icon: Search },
  { to: "/pre-screen", label: "AI Pre-Screen", icon: Camera },
  { to: "/alerts", label: "Alerts Map", icon: MapPin },
  { to: "/about", label: "About", icon: Info },
  { to: "/verify", label: "Verify Officially", icon: ShieldCheck },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0.6, 0.85]);
  const blurAmount = useTransform(scrollY, [0, 200], [12, 18]);
  const borderOpacity = useTransform(scrollY, [0, 200], [0.25, 0.55]);
  const shadowOpacity = useTransform(scrollY, [0, 200], [0.04, 0.12]);

  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(245, 249, 252, ${v})`),
          backdropFilter: useTransform(blurAmount, (v) => `saturate(180%) blur(${v}px)`),
          WebkitBackdropFilter: useTransform(blurAmount, (v) => `saturate(180%) blur(${v}px)`),
          borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(189, 216, 233, ${v})`),
          boxShadow: useTransform(shadowOpacity, (v) => `0 10px 30px -10px rgba(0, 29, 57, ${v})`),
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/medcheck-icon.svg" alt="MedCheck" className="h-9 w-9 rounded-lg shadow-sm transition-transform group-hover:scale-105" />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-navy">Med</span><span className="text-brand">Check</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 relative">
            {NAV.map(({ to, label }) => {
              const active = pathname === to || (to !== "/" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative px-3.5 py-2 text-sm font-medium text-navy/80 hover:text-navy transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/80 shadow-[0_4px_14px_rgba(10,65,116,0.12)] border border-light/60"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/account" aria-label="Account" className="h-10 w-10 grid place-items-center rounded-full hover:bg-white/70 transition-colors">
              <User className="h-5 w-5 text-navy" />
            </Link>
            <Link to="/report">
              <Button variant="gradient" size="default">Report a Fake</Button>
            </Link>
          </div>

          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-10 w-10 grid place-items-center rounded-full hover:bg-white/60 transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: "rgba(0,29,57,0.35)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 z-50 h-full w-[82%] max-w-sm glass-light-strong lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-light/40">
                <div className="flex items-center gap-2">
                  <img src="/medcheck-icon.svg" alt="" className="h-8 w-8 rounded-md" />
                  <span className="font-bold"><span className="text-navy">Med</span><span className="text-brand">Check</span></span>
                </div>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/60">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col p-3 gap-1">
                {NAV.map(({ to, label, icon: Icon }, i) => {
                  const active = pathname === to || (to !== "/" && pathname.startsWith(to));
                  return (
                    <motion.div key={to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                      <Link
                        to={to}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${active ? "bg-white/80 text-brand shadow-sm" : "text-navy/85 hover:bg-white/60"}`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-3 border-t border-light/40 pt-3 flex flex-col gap-2">
                  <Link to="/account" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-navy/85 hover:bg-white/60">
                    <User className="h-4.5 w-4.5" /> Account
                  </Link>
                  <Link to="/report">
                    <Button variant="gradient" className="w-full">Report a Fake Drug</Button>
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
