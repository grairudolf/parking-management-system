import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  ParkingSquare,
  BarChart3,
  Receipt,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  Search,
  Car,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser, logout } from "@/lib/auth";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/app/reserve", label: "Reserve Spot", icon: ParkingSquare },
  { to: "/app/analytics", label: "Park Analytics", icon: BarChart3 },
  { to: "/app/receipts", label: "Receipt Generation", icon: Receipt },
  { to: "/app/verification", label: "Entry/Exit Verification", icon: ShieldCheck },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
];

export function AppLayout({
  children,
  searchPlaceholder = "Search facilities, vehicles, or sessions...",
}: {
  children: React.ReactNode;
  searchPlaceholder?: string;
}) {
  const navigate = useNavigate();
  const router = useRouterState();
  const path = router.location.pathname;
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) navigate({ to: "/" });
    else setUser(u);
  }, [navigate]);


  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
              <Car className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div>
              <div className="text-lg font-bold leading-none">ParkCar</div>
              <div className="text-xs text-sidebar-foreground/60 mt-1">City Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {nav.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link
            to="/app/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
              path.startsWith("/app/settings")
                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b bg-background flex items-center gap-6 px-8">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={searchPlaceholder} className="pl-10 h-11 bg-secondary/60 border-0" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold">{user?.name ?? "Admin User"}</div>
                <div className="text-xs text-muted-foreground">{user?.role ?? "City Manager"}</div>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://i.pravatar.cc/80?img=12" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
