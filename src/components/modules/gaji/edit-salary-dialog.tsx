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
import { Edit3, CheckCircle2 } from "lucide-react";
import { useUpdateSalary, PayrollItem } from "@/hooks/use-gaji";

interface EditSalaryDialogProps {
  salaryItem: PayrollItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSalaryDialog({ salaryItem, open, onOpenChange }: EditSalaryDialogProps) {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const updateMutation = useUpdateSalary();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      gaji_pokok: salaryItem.gaji_pokok,
      tunjangan: salaryItem.tunjangan,
      potongan: salaryItem.potongan,
      tgl_mulai: salaryItem.tgl_mulai ? salaryItem.tgl_mulai.split("T")[0] : "",
      tgl_selesai: salaryItem.tgl_selesai ? salaryItem.tgl_selesai.split("T")[0] : "",
    },
  });

  React.useEffect(() => {
    if (salaryItem) {
      reset({
        gaji_pokok: salaryItem.gaji_pokok,
        tunjangan: salaryItem.tunjangan,
        potongan: salaryItem.potongan,
        tgl_mulai: salaryItem.tgl_mulai ? salaryItem.tgl_mulai.split("T")[0] : "",
        tgl_selesai: salaryItem.tgl_selesai ? salaryItem.tgl_selesai.split("T")[0] : "",
      });
    }
  }, [salaryItem, reset]);

  const onSubmit = async (data: {
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    tgl_mulai: string;
    tgl_selesai: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        id_riwayat_gaji: salaryItem.id_riwayat_gaji,
        gaji_pokok: Number(data.gaji_pokok),
        tunjangan: Number(data.tunjangan || 0),
        potongan: Number(data.potongan || 0),
        tgl_mulai: data.tgl_mulai,
        tgl_selesai: data.tgl_selesai || null,
      });
      setSuccessMsg("Catatan kompensasi berhasil diperbarui!");
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui data gaji";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Data Kompensasi & Gaji
            </DialogTitle>
            <DialogDescription>
              Perbarui komponen gaji pokok, tunjangan, atau potongan untuk{" "}
              <span className="font-semibold text-foreground">{salaryItem.nama || "karyawan"}</span>.
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
              <Label htmlFor="edit_gaji_pokok">Gaji Pokok (Rp) *</Label>
              <Input
                id="edit_gaji_pokok"
                type="number"
                {...register("gaji_pokok", { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit_tunjangan">Tunjangan Tetap (Rp)</Label>
                <Input id="edit_tunjangan" type="number" {...register("tunjangan")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit_potongan">Potongan (Rp)</Label>
                <Input id="edit_potongan" type="number" {...register("potongan")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit_sal_tgl_mulai">Tanggal Mulai Berlaku *</Label>
                <Input
                  id="edit_sal_tgl_mulai"
                  type="date"
                  {...register("tgl_mulai", { required: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit_sal_tgl_selesai">Tanggal Berakhir</Label>
                <Input id="edit_sal_tgl_selesai" type="date" {...register("tgl_selesai")} />
              </div>
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
