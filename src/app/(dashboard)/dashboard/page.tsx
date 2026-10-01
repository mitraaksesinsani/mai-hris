"use client";

import { useEmployees } from "@/hooks/use-employees";
import { useOrganizations, usePositions } from "@/hooks/use-organizations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  UserCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: employees } = useEmployees();
  const { data: organizations } = useOrganizations();
  const { data: positions } = usePositions();

  const totalEmployees = employees?.length || 0;
  const activeEmployees =
    employees?.filter((e) => e.status?.nama_status === "Tetap" || e.status?.nama_status === "Kontrak")
      .length || 0;
  const totalOrgs = organizations?.length || 0;
  const totalPositions = positions?.length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Shadcn-Mira High-Density Style */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-medium tracking-wide">
                PT. Mitra Akses Insani (MAI)
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                HRIS Enterprise
              </Badge>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Dashboard Terpadu Sumber Daya Manusia
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Arsitektur terpusat: <span className="font-medium text-foreground">Satu ID Karyawan, Satu ID Posisi, Satu Sistem Terintegrasi</span>. Monitor struktur organisasi, biodata, pergerakan karir internal, dan penggajian.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm">
              <Link href="/karyawan">Kelola Karyawan</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/organisasi">Struktur Organisasi</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Karyawan
            </CardTitle>
            <div className="rounded-md bg-muted p-1.5 text-foreground">
              <Users className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalEmployees}</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Semua divisi & unit</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Karyawan Aktif
            </CardTitle>
            <div className="rounded-md bg-muted p-1.5 text-foreground">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{activeEmployees}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Status Tetap & Kontrak</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Unit Organisasi
            </CardTitle>
            <div className="rounded-md bg-muted p-1.5 text-foreground">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalOrgs}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Direktorat, Divisi & Unit</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Master Posisi
            </CardTitle>
            <div className="rounded-md bg-muted p-1.5 text-foreground">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{totalPositions}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Level jabatan & tugas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Karyawan List */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Karyawan Terbaru
              </CardTitle>
              <CardDescription className="text-xs">Daftar penempatan karyawan terintegrasi</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link href="/karyawan">
                <span>Lihat Semua</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {employees?.slice(0, 4).map((k) => (
                <div key={k.id_karyawan} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted border border-border font-semibold text-[11px] text-foreground">
                      {k.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link
                        href={`/karyawan/${k.id_karyawan}`}
                        className="text-xs font-medium text-foreground hover:underline transition"
                      >
                        {k.nama}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        {k.posisi?.nama_posisi} • {k.organisasi?.nama_organisasi}
                      </p>
                    </div>
                  </div>
                  <Badge variant={k.status?.nama_status === "Tetap" ? "success" : "warning"} className="text-[10px]">
                    {k.status?.nama_status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database & Security Info Card */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Keamanan & Arsitektur
            </CardTitle>
            <CardDescription className="text-xs">Konfigurasi RLS & Database 10 Tabel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-lg bg-muted/40 p-2.5 space-y-1 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Row Level Security</span>
                <Badge variant="success" className="text-[10px]">10 Tabel Aktif</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Akses terproteksi per role: Admin, Manager, dan Employee. Riwayat gaji hanya dapat diakses hak otorisasi tertentu.
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-2.5 space-y-1 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Storage Dokumen</span>
                <Badge variant="outline" className="text-[10px]">Protected</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Dokumen KTP, kontrak kerja, dan foto profil karyawan disimpan dalam storage terisolasi.
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-2.5 space-y-1 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Effective Date Tracking</span>
                <Badge variant="purple" className="text-[10px]">Audit Trail</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Pemisahan data master aktif dan histori transaksi mutasi & kompensasi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
