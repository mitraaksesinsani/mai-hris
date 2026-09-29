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
import { History, Plus, CheckCircle2 } from "lucide-react";
import { useEmployees } from "@/hooks/use-employees";
import { usePositions } from "@/hooks/use-organizations";
import { useCreateHistory } from "@/hooks/use-histori";

export function AddHistoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: employees } = useEmployees();
  const { data: positions } = usePositions();
  const createHistoryMutation = useCreateHistory();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      id_karyawan: "",
      id_posisi: "",
      tgl_mulai: new Date().toISOString().split("T")[0],
      tgl_selesai: "",
      keterangan: "Promosi Jabatan",
    },
  });

  const onSubmit = async (data: {
    id_karyawan: string;
    id_posisi: string;
    tgl_mulai: string;
    tgl_selesai: string;
    keterangan: string;
  }) => {
    try {
      await createHistoryMutation.mutateAsync({
        id_karyawan: data.id_karyawan,
        id_posisi: data.id_posisi,
        tgl_mulai: data.tgl_mulai,
        tgl_selesai: data.tgl_selesai || null,
        keterangan: data.keterangan || null,
      });
      setSuccessMsg("Catatan mutasi / promosi berhasil disimpan!");
      setTimeout(() => {
        reset();
        setSuccessMsg(null);
        setOpen(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mencatat mutasi";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Catat Mutasi / Promosi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Catat Mutasi / Promosi Karyawan
            </DialogTitle>
            <DialogDescription>
              Menugaskan karyawan ke posisi baru dan memperbarui status aktif secara otomatis.
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
              <Label>Pilih Karyawan *</Label>
              <Controller
                name="id_karyawan"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih karyawan yang dimutasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees?.map((emp) => (
                        <SelectItem key={emp.id_karyawan} value={emp.id_karyawan}>
                          {emp.nama} ({emp.nik})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Posisi Baru *</Label>
              <Controller
                name="id_posisi"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions?.map((p) => (
                        <SelectItem key={p.id_posisi} value={p.id_posisi}>
                          {p.nama_posisi} ({p.level_posisi})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="tgl_mulai">Tanggal Berlaku Mulai *</Label>
                <Input
                  id="tgl_mulai"
                  type="date"
                  {...register("tgl_mulai", { required: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tgl_selesai">Tanggal Selesai (Opsional)</Label>
                <Input id="tgl_selesai" type="date" {...register("tgl_selesai")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keterangan">Keterangan Mutasi / Promosi</Label>
              <Input
                id="keterangan"
                {...register("keterangan")}
                placeholder="Contoh: Promosi Tech Lead Engineer"
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
              {isSubmitting ? "Menyimpan..." : "Simpan Catatan Mutasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
