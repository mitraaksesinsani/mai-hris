"use client";

import { OrgHierarchy } from "@/components/modules/organisasi/org-hierarchy";

export default function OrganisasiPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
          Master Struktur Organisasi
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tata kelola unit bisnis, hierarki direktorat, divisi, dan departemen PT. Mitra Akses Insani
        </p>
      </div>

      <OrgHierarchy />
    </div>
  );
}
