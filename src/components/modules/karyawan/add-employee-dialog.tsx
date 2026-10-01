"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus, CheckCircle2 } from "lucide-react";
import { useOrganizations, usePositions } from "@/hooks/use-organizations";
import { useCreateEmployee } from "@/hooks/use-employees";
import {
  CreateEmployeeSchema,
  type CreateEmployeeInput,
} from "@/lib/validations/employee.schema";

export function AddEmployeeDialog() {
  const [open, setOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const { data: pos } = usePositions();
  const createEmployeeMutation = useCreateEmployee();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      role: "employee",
      id_status: "11111111-1111-1111-1111-111111111111",
      tgl_masuk: new Date().toISOString().split("T")[0],
      id_organisasi: "",
      id_posisi: "",
    },
  });

  const onSubmit = async (data: CreateEmployeeInput) => {
    try {
      await createEmployeeMutation.mutateAsync(data);
      setSuccessMsg(`Karyawan ${data.nama} (${data.nik}) berhasil disimpan ke database!`);
      setTimeout(() => {
        reset();
        setSuccessMsg(null);
        setOpen(false);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data karyawan";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <UserPlus className="size-3.5" />
          <span>Tambah Karyawan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Registrasi Karyawan Baru</DialogTitle>
            <DialogDescription>
              Lengkapi biodata dan penempatan unit organisasi PT. Mitra Akses Insani (MAI).
            </DialogDescription>
          </DialogHeader>

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nik">Nomor Induk Karyawan (NIK) *</Label>
              <Input
                id="nik"
                placeholder="Contoh: MAI-2024-020"
                {...register("nik")}
                aria-invalid={!!errors.nik}
              />
              {errors.nik && (
                <p className="text-[11px] text-rose-600">{errors.nik.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Lengkap & Gelar *</Label>
              <Input
                id="nama"
                placeholder="Nama karyawan..."
                {...register("nama")}
                aria-invalid={!!errors.nama}
              />
              {errors.nama && (
                <p className="text-[11px] text-rose-600">{errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Perusahaan *</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@mitraaksesinsani.co.id"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="no_telp">No. WhatsApp / Telepon</Label>
              <Input
                id="no_telp"
                placeholder="08xxxxxxxxxx"
                {...register("no_telp")}
                aria-invalid={!!errors.no_telp}
              />
              {errors.no_telp && (
                <p className="text-[11px] text-rose-600">{errors.no_telp.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Unit Organisasi *</Label>
              <Controller
                name="id_organisasi"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Unit Organisasi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {orgs?.map((o) => (
                        <SelectItem key={o.id_organisasi} value={o.id_organisasi}>
                          {o.nama_organisasi} ({o.jenis_organisasi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_organisasi && (
                <p className="text-[11px] text-rose-600">{errors.id_organisasi.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Posisi / Jabatan *</Label>
              <Controller
                name="id_posisi"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Posisi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pos?.map((p) => (
                        <SelectItem key={p.id_posisi} value={p.id_posisi}>
                          {p.nama_posisi} - {p.level_posisi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.id_posisi && (
                <p className="text-[11px] text-rose-600">{errors.id_posisi.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Status Karyawan *</Label>
              <Controller
                name="id_status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11111111-1111-1111-1111-111111111111">Tetap (PKWTT)</SelectItem>
                      <SelectItem value="22222222-2222-2222-2222-222222222222">Kontrak (PKWT)</SelectItem>
                      <SelectItem value="33333333-3333-3333-3333-333333333333">Probation (3 Bulan)</SelectItem>
                      <SelectItem value="44444444-4444-4444-4444-444444444444">Magang (Internship)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tgl_masuk">Tanggal Masuk *</Label>
              <Input id="tgl_masuk" type="date" {...register("tgl_masuk")} aria-invalid={!!errors.tgl_masuk} />
              {errors.tgl_masuk && (
                <p className="text-[11px] text-rose-600">{errors.tgl_masuk.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Role Sistem Akses *</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee (Akses Profil Mandiri)</SelectItem>
                      <SelectItem value="manager">Manager (Akses Tim Divisi)</SelectItem>
                      <SelectItem value="admin">Admin (Akses Penuh HRIS)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dokumen">Upload Dokumen KTP / Kontrak</Label>
              <Input id="dokumen" type="file" className="text-[11px] cursor-pointer" />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || createEmployeeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting || createEmployeeMutation.isPending ? "Menyimpan ke DB..." : "Simpan Data Karyawan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
