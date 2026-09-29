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
import { BadgeDollarSign, Plus, CheckCircle2 } from "lucide-react";
import { useEmployees } from "@/hooks/use-employees";
import { useCreateSalary } from "@/hooks/use-gaji";

export function AddSalaryDialog() {
  const [open, setOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: employees } = useEmployees();
  const createSalaryMutation = useCreateSalary();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      id_karyawan: "",
      gaji_pokok: 12000000,
      tunjangan: 2500000,
      potongan: 400000,
      tgl_mulai: new Date().toISOString().split("T")[0],
      tgl_selesai: "",
    },
  });

  const onSubmit = async (data: {
    id_karyawan: string;
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    tgl_mulai: string;
    tgl_selesai: string;
  }) => {
    try {
      await createSalaryMutation.mutateAsync({
        id_karyawan: data.id_karyawan,
        gaji_pokok: Number(data.gaji_pokok),
        tunjangan: Number(data.tunjangan || 0),
        potongan: Number(data.potongan || 0),
        tgl_mulai: data.tgl_mulai,
        tgl_selesai: data.tgl_selesai || null,
      });
      setSuccessMsg("Penyesuaian gaji berhasil disimpan ke database!");
      setTimeout(() => {
        reset();
        setSuccessMsg(null);
        setOpen(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data gaji";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Penyesuaian Gaji</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4" />
              Penyesuaian Kompensasi & Gaji
            </DialogTitle>
            <DialogDescription>
              Catat kenaikan berkala, perubahan tunjangan, atau penyesuaian take-home pay karyawan.
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
                      <SelectValue placeholder="Pilih karyawan" />
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
              <Label htmlFor="gaji_pokok">Gaji Pokok (Rp) *</Label>
              <Input
                id="gaji_pokok"
                type="number"
                {...register("gaji_pokok", { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="tunjangan">Tunjangan Tetap (Rp)</Label>
                <Input id="tunjangan" type="number" {...register("tunjangan")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="potongan">Potongan (BPJS/PPH) (Rp)</Label>
                <Input id="potongan" type="number" {...register("potongan")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="sal_tgl_mulai">Tanggal Mulai Berlaku *</Label>
                <Input
                  id="sal_tgl_mulai"
                  type="date"
                  {...register("tgl_mulai", { required: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sal_tgl_selesai">Tanggal Berakhir (Opsional)</Label>
                <Input id="sal_tgl_selesai" type="date" {...register("tgl_selesai")} />
              </div>
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
              {isSubmitting ? "Menyimpan..." : "Simpan Data Gaji"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
