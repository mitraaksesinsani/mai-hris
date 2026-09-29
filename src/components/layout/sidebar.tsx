"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  BadgeDollarSign,
  History,
  ShieldCheck,
  LogOut,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Data Karyawan",
    href: "/karyawan",
    icon: Users,
    badge: "Utama",
  },
  {
    name: "Struktur Organisasi",
    href: "/organisasi",
    icon: Building2,
  },
  {
    name: "Posisi & Jabatan",
    href: "/posisi",
    icon: Briefcase,
  },
  {
    name: "Riwayat & Histori",
    href: "/histori",
    icon: History,
  },
  {
    name: "Penggajian (Payroll)",
    href: "/gaji",
    icon: BadgeDollarSign,
  },
];

interface UserProfile {
  name: string;
  role: string;
  username: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile>({
    name: "Administrator MAI",
    role: "admin",
    username: "admin",
  });

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("mai_user");
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
          <FolderGit2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-semibold text-foreground tracking-tight text-sm">MAI HRIS</span>
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[9px] font-mono font-medium text-muted-foreground border border-border">v1.0</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">PT. Mitra Akses Insani</span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Modul HRIS
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-border/50 shadow-2xs"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground border border-border">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Info / Security Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2 border border-border">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs rounded-md">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="capitalize">{user.role} HR</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleLogout}
            title="Keluar"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
