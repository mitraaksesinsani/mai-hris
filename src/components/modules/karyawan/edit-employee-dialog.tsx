"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { CheckCircle2, Edit3 } from "lucide-react";
import { useOrganizations, usePositions } from "@/hooks/use-organizations";
import { useUpdateEmployee } from "@/hooks/use-employees";
import { KaryawanWithRelations } from "@/types/hris.types";

interface EditEmployeeDialogProps {
  karyawan: KaryawanWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  nik: string;
  nama: string;
  email: string;
  no_telp: string;
  id_organisasi: string;
  id_posisi: string;
  id_status: string;
  tgl_masuk: string;
  role: "admin" | "manager" | "employee";
}

export function EditEmployeeDialog({ karyawan, open, onOpenChange }: EditEmployeeDialogProps) {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const { data: pos } = usePositions();
  const updateEmployeeMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nik: karyawan.nik,
      nama: karyawan.nama,
      email: karyawan.email || "",
      no_telp: karyawan.no_telp || "",
      id_organisasi: karyawan.id_organisasi || "",
      id_posisi: karyawan.id_posisi || "",
      id_status: karyawan.id_status || "11111111-1111-1111-1111-111111111111",
      tgl_masuk: karyawan.tgl_masuk ? karyawan.tgl_masuk.split("T")[0] : "",
      role: (karyawan.role as "admin" | "manager" | "employee") || "employee",
    },
  });

  React.useEffect(() => {
    if (karyawan) {
      reset({
        nik: karyawan.nik,
        nama: karyawan.nama,
        email: karyawan.email || "",
        no_telp: karyawan.no_telp || "",
        id_organisasi: karyawan.id_organisasi || "",
        id_posisi: karyawan.id_posisi || "",
        id_status: karyawan.id_status || "11111111-1111-1111-1111-111111111111",
        tgl_masuk: karyawan.tgl_masuk ? karyawan.tgl_masuk.split("T")[0] : "",
        role: (karyawan.role as "admin" | "manager" | "employee") || "employee",
      });
    }
  }, [karyawan, reset]);

  const onSubmit = async (data: Record<string, any>) => {
    try {
      await updateEmployeeMutation.mutateAsync({
        id: karyawan.id_karyawan,
        data: {
          ...data,
          no_telp: data.no_telp || null,
        },
      });
      setSuccessMsg(`Data ${data.nama} berhasil diperbarui di database!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui data karyawan";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Data Karyawan
            </DialogTitle>
            <DialogDescription>
              Perbarui informasi identitas, jabatan, dan status kerja karyawan PT. MAI.
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
              <Label htmlFor="edit-nik">Nomor Induk Karyawan (NIK)</Label>
              <Input id="edit-nik" {...register("nik", { required: true })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-nama">Nama Lengkap</Label>
              <Input id="edit-nama" {...register("nama", { required: true })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email Perusahaan</Label>
              <Input id="edit-email" type="email" {...register("email", { required: true })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-telp">Nomor WhatsApp / HP</Label>
              <Input id="edit-telp" {...register("no_telp")} />
            </div>

            <div className="space-y-1.5">
              <Label>Unit Organisasi / Departemen</Label>
              <Controller
                name="id_organisasi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Unit" />
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
            </div>

            <div className="space-y-1.5">
              <Label>Posisi Pekerjaan</Label>
              <Controller
                name="id_posisi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Posisi" />
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
            </div>

            <div className="space-y-1.5">
              <Label>Status Karyawan</Label>
              <Controller
                name="id_status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11111111-1111-1111-1111-111111111111">Tetap (PKWTT)</SelectItem>
                      <SelectItem value="22222222-2222-2222-2222-222222222222">Kontrak (PKWT)</SelectItem>
                      <SelectItem value="33333333-3333-3333-3333-333333333333">Probation</SelectItem>
                      <SelectItem value="44444444-4444-4444-4444-444444444444">Magang</SelectItem>
                      <SelectItem value="55555555-5555-5555-5555-555555555555">Non Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Hak Akses Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || "employee"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator HR</SelectItem>
                      <SelectItem value="manager">Manager / Head</SelectItem>
                      <SelectItem value="employee">Staff / Karyawan</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="edit-tgl-masuk">Tanggal Masuk Bekerja</Label>
              <Input id="edit-tgl-masuk" type="date" {...register("tgl_masuk", { required: true })} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
