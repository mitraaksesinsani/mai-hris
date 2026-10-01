"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  BadgeDollarSign,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
          <Image
            src="/logo.png"
            alt="MAI HRIS"
            width={32}
            height={32}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-semibold text-foreground tracking-tight text-sm">MAI HRIS</span>
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground border border-border">v1.0</span>
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
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-border/50"
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
    </aside>
  );
}
