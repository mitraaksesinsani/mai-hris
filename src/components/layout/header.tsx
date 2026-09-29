"use client";

import { Bell, Search, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({
  title = "HRIS Portal",
  description = "Satu ID Karyawan, Satu ID Posisi, Satu Sistem Terintegrasi",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-heading text-sm font-semibold text-foreground tracking-tight">{title}</h1>
        <p className="text-[11px] text-muted-foreground hidden sm:block">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search using Shadcn Input */}
        <div className="relative hidden md:block w-56">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari NIK, Nama, Posisi..."
            className="h-7 pl-8 pr-3 text-xs bg-muted/30 border-border rounded-md"
          />
        </div>

        {/* Database Status indicator using Shadcn Badge */}
        <Badge
          variant="outline"
          className="gap-1.5 py-0.5 px-2 text-[10px] font-medium border-border bg-card text-foreground"
        >
          <Database className="h-3 w-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Database Aktif</span>
        </Badge>

        {/* Notifications using Shadcn Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifikasi"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        {/* Environment Badge */}
        <Badge variant="secondary" className="text-[9px] uppercase font-mono tracking-wider">
          Production Ready
        </Badge>
      </div>
    </header>
  );
}
