"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Home,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  name: string;
  role: string;
  username: string;
  email?: string;
}

const routeMap: Record<string, { label: string; parentHref?: string; parentLabel?: string }> = {
  "/dashboard": { label: "Dashboard" },
  "/karyawan": { label: "Data Karyawan" },
  "/organisasi": { label: "Struktur Organisasi" },
  "/posisi": { label: "Posisi & Jabatan" },
  "/histori": { label: "Riwayat & Histori" },
  "/gaji": { label: "Penggajian (Payroll)" },
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<UserProfile>({
    name: "Administrator MAI",
    role: "admin",
    username: "admin",
    email: "admin@mitraaksesinsani.co.id",
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

  // Determine breadcrumb items
  interface BreadcrumbItem {
    label: string;
    href: string;
    isCurrent?: boolean;
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/dashboard") {
      return [{ label: "Dashboard", href: "/dashboard", isCurrent: true }];
    }

    if (pathname.startsWith("/karyawan/") && pathname !== "/karyawan") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Data Karyawan", href: "/karyawan" },
        { label: "Detail Karyawan", href: pathname, isCurrent: true },
      ];
    }

    const currentRoute = routeMap[pathname];
    if (currentRoute) {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: currentRoute.label, href: pathname, isCurrent: true },
      ];
    }

    // Default fallback
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/dashboard" }];
    let accumulatedPath = "";
    segments.forEach((seg, idx) => {
      accumulatedPath += `/${seg}`;
      const isLast = idx === segments.length - 1;
      crumbs.push({
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        href: accumulatedPath,
        isCurrent: isLast,
      });
    });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border bg-background px-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href + i}>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            {crumb.isCurrent ? (
              <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground text-muted-foreground transition-colors truncate max-w-[150px]"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right side: Notifications & User Profile Dropdown */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifikasi"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 p-1.5 pr-2.5 text-left hover:bg-muted/70 transition-colors outline-none cursor-pointer"
            >
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs rounded-md">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col min-w-0">
                <p className="truncate text-xs font-medium text-foreground leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="capitalize">{user.role} HR</span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold text-foreground leading-none">{user.name}</p>
                <p className="text-[11px] text-muted-foreground leading-none">{user.email || user.username}</p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-foreground border border-border">
                    <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
                    Role: {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/karyawan" className="cursor-pointer">
                <User className="h-3.5 w-3.5 mr-2" />
                <span>Profil Saya</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/organisasi" className="cursor-pointer">
                <Settings className="h-3.5 w-3.5 mr-2" />
                <span>Pengaturan Sistem</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/histori" className="cursor-pointer">
                <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                <span>Log Sesi & Histori</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2 text-destructive" />
              <span>Keluar (Logout)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
