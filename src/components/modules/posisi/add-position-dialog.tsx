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
import { Briefcase, Plus, CheckCircle2 } from "lucide-react";
import { useOrganizations, useCreatePosition } from "@/hooks/use-organizations";

export function AddPositionDialog() {
  const [open, setOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const createMutation = useCreatePosition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nama_posisi: "",
      level_posisi: "Staff",
      id_organisasi: "",
    },
  });

  const onSubmit = async (data: {
    nama_posisi: string;
    level_posisi: string;
    id_organisasi: string;
  }) => {
    try {
      await createMutation.mutateAsync({
        nama_posisi: data.nama_posisi,
        level_posisi: data.level_posisi,
        id_organisasi: data.id_organisasi || null,
      });
      setSuccessMsg(`Posisi "${data.nama_posisi}" berhasil ditambahkan!`);
      setTimeout(() => {
        reset();
        setSuccessMsg(null);
        setOpen(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan posisi";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Posisi Baru</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Tambah Posisi Kerja
            </DialogTitle>
            <DialogDescription>
              Daftarkan nama posisi, tingkatan level jabatan, dan unit kerja terkait.
            </DialogDescription>
          </DialogHeader>

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="nama_pos">Nama Posisi / Job Title *</Label>
              <Input
                id="nama_pos"
                {...register("nama_posisi", { required: true })}
                placeholder="Contoh: Backend Engineer"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tingkat Level Posisi</Label>
              <Controller
                name="level_posisi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Executive">Executive (Direksi / C-Level)</SelectItem>
                      <SelectItem value="Head">Head / VP</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Senior">Senior Specialist / Lead</SelectItem>
                      <SelectItem value="Staff">Staff / Officer</SelectItem>
                      <SelectItem value="Intern">Intern / Magang</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Unit Organisasi Penempatan</Label>
              <Controller
                name="id_organisasi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih unit organisasi" />
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
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Posisi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
