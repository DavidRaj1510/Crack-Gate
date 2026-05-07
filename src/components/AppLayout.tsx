import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Countdown from "@/components/Countdown";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/topics", label: "Topics" },
  { to: "/progress", label: "Progress" },
  { to: "/checklist", label: "Checklist" },
];

export default function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav("/auth", { replace: true });
  }, [user, loading, nav]);
  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Countdown />
      <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden truncate sm:inline">Signed in as {user.email}</span>
            <Button size="sm" variant="ghost" onClick={() => signOut()}>
              <LogOut className="mr-1 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <Outlet />

      <footer className="border-t border-border bg-primary py-10 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <div className="font-display text-2xl font-semibold">
            All the best for GATE CS 2027 🎯
          </div>
          <p className="mt-2 text-sm text-primary-foreground/60">
            Built with 15-year data analysis · Smart prep beats hard prep.
          </p>
        </div>
      </footer>
    </div>
  );
}