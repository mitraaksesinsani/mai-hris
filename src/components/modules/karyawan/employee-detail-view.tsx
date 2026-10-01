"use client";

import { useState } from "react";
import { KaryawanWithRelations } from "@/types/hris.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Briefcase,
  MapPin,
  GraduationCap,
  History,
  BadgeDollarSign,
  FileText,
  ShieldCheck,
  Download,
  Lock,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { EditEmployeeDialog } from "./edit-employee-dialog";
import {
  AddAlamatDialog,
  AddPendidikanDialog,
  AddPengalamanDialog,
} from "./sub-entity-dialogs";
import {
  useDeleteAlamat,
  useDeletePendidikan,
  useDeletePengalaman,
} from "@/hooks/use-employees";

interface EmployeeDetailViewProps {
  karyawan: KaryawanWithRelations;
}

export function EmployeeDetailView({ karyawan }: EmployeeDetailViewProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [addAlamatOpen, setAddAlamatOpen] = useState(false);
  const [addPendidikanOpen, setAddPendidikanOpen] = useState(false);
  const [addPengalamanOpen, setAddPengalamanOpen] = useState(false);

  const deleteAlamatMutation = useDeleteAlamat();
  const deletePendidikanMutation = useDeletePendidikan();
  const deletePengalamanMutation = useDeletePengalaman();

  const initials = karyawan.nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-5">
      {/* Profile Header Banner using Shadcn Card & Avatar */}
      <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar className="h-14 w-14 rounded-lg border border-border">
              <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground rounded-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground">{karyawan.nama}</h1>
                <Badge variant={karyawan.status?.nama_status === "Tetap" ? "success" : "warning"} className="text-[10px]">
                  {karyawan.status?.nama_status || "Aktif"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 mt-0.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{karyawan.nik}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  {karyawan.posisi?.nama_posisi || "Posisi Belum Diatur"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {karyawan.organisasi?.nama_organisasi || "Unit Belum Diatur"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Biodata</span>
            </Button>
            <div className="rounded-lg bg-muted/40 border border-border px-3 py-1.5 text-right">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Role Sistem</span>
              <p className="text-xs font-semibold text-foreground capitalize flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {karyawan.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Tabs Details */}
      <Tabs defaultValue="biodata" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full bg-muted/50 p-1 rounded-lg border border-border">
          <TabsTrigger value="biodata" className="text-xs">Biodata & Kontak</TabsTrigger>
          <TabsTrigger value="pendukung" className="text-xs">Data Pendukung</TabsTrigger>
          <TabsTrigger value="posisi" className="text-xs">Riwayat Posisi</TabsTrigger>
          <TabsTrigger value="gaji" className="text-xs">Riwayat Gaji</TabsTrigger>
          <TabsTrigger value="dokumen" className="text-xs">Dokumen Terproteksi</TabsTrigger>
        </TabsList>

        {/* Tab 1: Biodata */}
        <TabsContent value="biodata" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Informasi Biodata & Penempatan</CardTitle>
                <CardDescription className="text-xs">Data identitas resmi karyawan PT. Mitra Akses Insani</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-7"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">Nomor Induk Karyawan (NIK)</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{karyawan.nik}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Email Kantor</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{karyawan.email || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">No. Telepon / WhatsApp</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{karyawan.no_telp || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Tempat, Tanggal Lahir</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {karyawan.tempat_lahir || "-"}, {formatDate(karyawan.tgl_lahir)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Jenis Kelamin</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{karyawan.jenis_kelamin || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Agama</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{karyawan.agama || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Tanggal Mulai Bekerja</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{formatDate(karyawan.tgl_masuk)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Tanggal Keluar (Jika Resign)</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {karyawan.tgl_keluar ? formatDate(karyawan.tgl_keluar) : "Masih Aktif Bekerja"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Tingkat Level Posisi</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {karyawan.posisi?.level_posisi || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Pendukung (Alamat, Pendidikan, Pengalaman) */}
        <TabsContent value="pendukung" className="mt-4 space-y-4">
          {/* Alamat */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-foreground" />
                Data Alamat (KTP & Domisili)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs h-7"
                onClick={() => setAddAlamatOpen(true)}
              >
                <Plus className="h-3 w-3" />
                <span>Tambah Alamat</span>
              </Button>
            </CardHeader>
            <CardContent>
              {karyawan.alamat?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {karyawan.alamat.map((a) => (
                    <div key={a.id_alamat} className="rounded-lg border border-border bg-muted/30 p-3 flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-1">{a.jenis_alamat}</Badge>
                        <p className="font-semibold text-foreground">{a.alamat}</p>
                        <p className="text-muted-foreground mt-0.5">{a.kota}, {a.provinsi} {a.kode_pos}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() =>
                          deleteAlamatMutation.mutate({
                            id_karyawan: karyawan.id_karyawan,
                            id_alamat: a.id_alamat,
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada data alamat tercatat.</p>
              )}
            </CardContent>
          </Card>

          {/* Pendidikan */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-foreground" />
                Riwayat Pendidikan
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs h-7"
                onClick={() => setAddPendidikanOpen(true)}
              >
                <Plus className="h-3 w-3" />
                <span>Tambah Pendidikan</span>
              </Button>
            </CardHeader>
            <CardContent>
              {karyawan.pendidikan?.length ? (
                <div className="space-y-2 text-xs">
                  {karyawan.pendidikan.map((p) => (
                    <div key={p.id_pendidikan} className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{p.nama_institusi}</span>
                          <Badge variant="secondary" className="text-[10px]">{p.jenjang}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-0.5">{p.jurusan}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-muted-foreground">Lulus {p.tahun_lulus}</span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            deletePendidikanMutation.mutate({
                              id_karyawan: karyawan.id_karyawan,
                              id_pendidikan: p.id_pendidikan,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada data pendidikan tercatat.</p>
              )}
            </CardContent>
          </Card>

          {/* Pengalaman Kerja */}
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-foreground" />
                Pengalaman Kerja Terdahulu
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs h-7"
                onClick={() => setAddPengalamanOpen(true)}
              >
                <Plus className="h-3 w-3" />
                <span>Tambah Pengalaman</span>
              </Button>
            </CardHeader>
            <CardContent>
              {karyawan.pengalaman?.length ? (
                <div className="space-y-2 text-xs">
                  {karyawan.pengalaman.map((exp) => (
                    <div key={exp.id_pengalaman} className="rounded-lg border border-border bg-card p-2.5 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{exp.posisi}</span>
                          <span className="text-muted-foreground text-[11px]">
                            {formatDate(exp.periode_mulai)} s/d {exp.periode_selesai ? formatDate(exp.periode_selesai) : "Sekarang"}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-medium mt-0.5">{exp.nama_perusahaan}</p>
                        {exp.keterangan && <p className="text-muted-foreground mt-1 text-[11px]">{exp.keterangan}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                        onClick={() =>
                          deletePengalamanMutation.mutate({
                            id_karyawan: karyawan.id_karyawan,
                            id_pengalaman: exp.id_pengalaman,
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada catatan pengalaman kerja terdahulu.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Riwayat Posisi */}
        <TabsContent value="posisi" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-foreground" />
                Histori Perubahan Posisi & Jabatan
              </CardTitle>
              <CardDescription className="text-xs">
                Pelacakan effective date untuk promosi, demosi, atau rotasi divisi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {karyawan.riwayat_posisi?.length ? (
                <div className="relative border-l border-border ml-3 space-y-4 my-2">
                  {karyawan.riwayat_posisi.map((rp) => (
                    <div key={rp.id_riwayat_posisi} className="relative pl-5">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs text-foreground">
                            {rp.posisi?.nama_posisi || "Posisi"}
                          </h4>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDate(rp.tgl_mulai)} — {rp.tgl_selesai ? formatDate(rp.tgl_selesai) : "Sekarang"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{rp.keterangan || "Penempatan resmi perusahaan"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada riwayat mutasi / rotasi posisi.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Riwayat Gaji */}
        <TabsContent value="gaji" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BadgeDollarSign className="h-3.5 w-3.5 text-foreground" />
                    Histori Kompensasi & Riwayat Gaji
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Informasi rahasia yang dilindungi oleh Supabase Row Level Security (RLS)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground border border-border">
                  <Lock className="h-3 w-3" />
                  <span>Akses Terproteksi</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {karyawan.riwayat_gaji?.length ? (
                <div className="space-y-2.5">
                  {karyawan.riwayat_gaji.map((g) => {
                    const totalTHP = Number(g.gaji_pokok) + Number(g.tunjangan) - Number(g.potongan);
                    return (
                      <div key={g.id_riwayat_gaji} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center justify-between border-b border-border pb-1.5 mb-2">
                          <span className="text-xs text-muted-foreground">
                            Periode: {formatDate(g.tgl_mulai)} — {g.tgl_selesai ? formatDate(g.tgl_selesai) : "Berlaku Saat Ini"}
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            THP: {formatRupiah(totalTHP)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground text-[11px]">Gaji Pokok</span>
                            <p className="font-medium text-foreground">{formatRupiah(g.gaji_pokok)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-[11px]">Tunjangan Tetap</span>
                            <p className="font-medium text-foreground">{formatRupiah(g.tunjangan)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-[11px]">Potongan</span>
                            <p className="font-medium text-destructive">-{formatRupiah(g.potongan)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada riwayat slip gaji tercatat.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Dokumen Storage Terproteksi */}
        <TabsContent value="dokumen" className="mt-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-foreground" />
                Arsip Dokumen Terproteksi (Supabase Storage)
              </CardTitle>
              <CardDescription className="text-xs">
                Tersimpan di private bucket `employee-documents` dengan token akses terotentikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Dokumen 1: KTP */}
                <div className="rounded-lg border border-border bg-card p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">KTP</span>
                    <Badge variant="outline" className="text-[10px]">PDF/IMG</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Identitas kependudukan nasional</p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-7">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download KTP</span>
                  </Button>
                </div>

                {/* Dokumen 2: Kontrak Kerja */}
                <div className="rounded-lg border border-border bg-card p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Surat Kontrak</span>
                    <Badge variant="outline" className="text-[10px]">PDF</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Kontrak kerja resmi (PKWT/PKWTT)</p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-7">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Kontrak</span>
                  </Button>
                </div>

                {/* Dokumen 3: Foto Profil Resmi */}
                <div className="rounded-lg border border-border bg-card p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Pas Foto</span>
                    <Badge variant="outline" className="text-[10px]">JPG/PNG</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Foto background merah / biru</p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-7">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Foto</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditEmployeeDialog
        karyawan={karyawan}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <AddAlamatDialog
        id_karyawan={karyawan.id_karyawan}
        open={addAlamatOpen}
        onOpenChange={setAddAlamatOpen}
      />
      <AddPendidikanDialog
        id_karyawan={karyawan.id_karyawan}
        open={addPendidikanOpen}
        onOpenChange={setAddPendidikanOpen}
      />
      <AddPengalamanDialog
        id_karyawan={karyawan.id_karyawan}
        open={addPengalamanOpen}
        onOpenChange={setAddPengalamanOpen}
      />
    </div>
  );
}
