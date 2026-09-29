"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useAddAlamat, useAddPendidikan, useAddPengalaman } from "@/hooks/use-employees";

// ================= ALAMAT =================
export function AddAlamatDialog({
  id_karyawan,
  open,
  onOpenChange,
}: {
  id_karyawan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addMutation = useAddAlamat();
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      jenis_alamat: "KTP",
      alamat: "",
      kota: "Jakarta",
      provinsi: "DKI Jakarta",
      kode_pos: "",
    },
  });

  const onSubmit = async (data: {
    jenis_alamat: string;
    alamat: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
  }) => {
    try {
      await addMutation.mutateAsync({ id_karyawan, data });
      reset();
      onOpenChange(false);
    } catch {
      alert("Gagal menambahkan alamat");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" />
              Tambah Alamat Karyawan
            </DialogTitle>
            <DialogDescription className="text-xs">
              Catat alamat domisili atau KTP karyawan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Jenis Alamat</Label>
              <Select defaultValue="KTP" onValueChange={(v) => setValue("jenis_alamat", v ?? "KTP")}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KTP">KTP Resmi</SelectItem>
                  <SelectItem value="Domisili">Domisili Tempat Tinggal</SelectItem>
                  <SelectItem value="Darurat">Alamat Kontak Darurat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Alamat Lengkap</Label>
              <Input className="h-8 text-xs" {...register("alamat", { required: true })} placeholder="Jl. Sudirman No..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Kota / Kabupaten</Label>
                <Input className="h-8 text-xs" {...register("kota", { required: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Provinsi</Label>
                <Input className="h-8 text-xs" {...register("provinsi", { required: true })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kode Pos</Label>
              <Input className="h-8 text-xs" {...register("kode_pos", { required: true })} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Menyimpan..." : "Simpan Alamat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ================= PENDIDIKAN =================
export function AddPendidikanDialog({
  id_karyawan,
  open,
  onOpenChange,
}: {
  id_karyawan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addMutation = useAddPendidikan();
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      jenjang: "S1",
      nama_institusi: "",
      jurusan: "",
      tahun_lulus: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: {
    jenjang: string;
    nama_institusi: string;
    jurusan: string;
    tahun_lulus: number;
  }) => {
    try {
      await addMutation.mutateAsync({
        id_karyawan,
        data: { ...data, tahun_lulus: Number(data.tahun_lulus) },
      });
      reset();
      onOpenChange(false);
    } catch {
      alert("Gagal menambahkan riwayat pendidikan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4" />
              Tambah Riwayat Pendidikan
            </DialogTitle>
            <DialogDescription className="text-xs">
              Catat gelar dan riwayat akademis resmi karyawan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Jenjang Pendidikan</Label>
              <Select defaultValue="S1" onValueChange={(v) => setValue("jenjang", v ?? "S1")}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA/SMK">SMA/SMK Sederajat</SelectItem>
                  <SelectItem value="D3">Diploma 3 (D3)</SelectItem>
                  <SelectItem value="D4">Diploma 4 (D4)</SelectItem>
                  <SelectItem value="S1">Strata 1 (S1)</SelectItem>
                  <SelectItem value="S2">Magister (S2)</SelectItem>
                  <SelectItem value="S3">Doktor (S3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nama Sekolah / Universitas</Label>
              <Input className="h-8 text-xs" {...register("nama_institusi", { required: true })} placeholder="Universitas Indonesia..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Jurusan / Program Studi</Label>
                <Input className="h-8 text-xs" {...register("jurusan", { required: true })} placeholder="Teknik Informatika..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tahun Lulus</Label>
                <Input className="h-8 text-xs" type="number" {...register("tahun_lulus", { required: true })} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Menyimpan..." : "Simpan Pendidikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ================= PENGALAMAN =================
export function AddPengalamanDialog({
  id_karyawan,
  open,
  onOpenChange,
}: {
  id_karyawan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addMutation = useAddPengalaman();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nama_perusahaan: "",
      posisi: "",
      periode_mulai: "",
      periode_selesai: "",
      keterangan: "",
    },
  });

  const onSubmit = async (data: {
    nama_perusahaan: string;
    posisi: string;
    periode_mulai: string;
    periode_selesai: string;
    keterangan?: string;
  }) => {
    try {
      await addMutation.mutateAsync({ id_karyawan, data });
      reset();
      onOpenChange(false);
    } catch {
      alert("Gagal menambahkan riwayat pengalaman");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4" />
              Tambah Pengalaman Kerja
            </DialogTitle>
            <DialogDescription className="text-xs">
              Catat riwayat karir sebelumnya di perusahaan terdahulu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Perusahaan / Institusi</Label>
              <Input className="h-8 text-xs" {...register("nama_perusahaan", { required: true })} placeholder="PT. ABC Global..." />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Posisi / Jabatan</Label>
              <Input className="h-8 text-xs" {...register("posisi", { required: true })} placeholder="Software Engineer..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Periode Mulai</Label>
                <Input className="h-8 text-xs" type="date" {...register("periode_mulai", { required: true })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Periode Selesai</Label>
                <Input className="h-8 text-xs" type="date" {...register("periode_selesai", { required: true })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Keterangan / Tanggung Jawab (Opsional)</Label>
              <Input className="h-8 text-xs" {...register("keterangan")} placeholder="Mengelola sistem..." />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Menyimpan..." : "Simpan Pengalaman"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
