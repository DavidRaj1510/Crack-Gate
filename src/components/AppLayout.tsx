import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Countdown from "@/components/Countdown";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/topics", label: "Topics" },
  { to: "/progress", label: "Progress" },
  { to: "/checklist", label: "Weekly" },
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
        <div className="container relative mx-auto flex items-center justify-center px-6 py-3">
          <nav className="flex flex-wrap items-center justify-center gap-1">
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" aria-label="Account">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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