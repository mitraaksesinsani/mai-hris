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
import { Edit3, CheckCircle2 } from "lucide-react";
import { usePositions } from "@/hooks/use-organizations";
import { useUpdateHistory, PositionHistoryItem } from "@/hooks/use-histori";

interface EditHistoryDialogProps {
  historyItem: PositionHistoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHistoryDialog({ historyItem, open, onOpenChange }: EditHistoryDialogProps) {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: positions } = usePositions();
  const updateMutation = useUpdateHistory();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      id_posisi: historyItem.id_posisi,
      tgl_mulai: historyItem.tgl_mulai ? historyItem.tgl_mulai.split("T")[0] : "",
      tgl_selesai: historyItem.tgl_selesai ? historyItem.tgl_selesai.split("T")[0] : "",
      keterangan: historyItem.keterangan || "",
    },
  });

  React.useEffect(() => {
    if (historyItem) {
      reset({
        id_posisi: historyItem.id_posisi,
        tgl_mulai: historyItem.tgl_mulai ? historyItem.tgl_mulai.split("T")[0] : "",
        tgl_selesai: historyItem.tgl_selesai ? historyItem.tgl_selesai.split("T")[0] : "",
        keterangan: historyItem.keterangan || "",
      });
    }
  }, [historyItem, reset]);

  const onSubmit = async (data: {
    id_posisi: string;
    tgl_mulai: string;
    tgl_selesai: string;
    keterangan: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        id_riwayat_posisi: historyItem.id_riwayat_posisi,
        id_posisi: data.id_posisi,
        tgl_mulai: data.tgl_mulai,
        tgl_selesai: data.tgl_selesai || null,
        keterangan: data.keterangan || null,
      });
      setSuccessMsg("Catatan riwayat posisi berhasil diperbarui!");
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui riwayat";
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
              Edit Riwayat Mutasi / Posisi
            </DialogTitle>
            <DialogDescription>
              Perbarui rincian posisi atau rentang periode bertugas untuk{" "}
              <span className="font-semibold text-foreground">{historyItem.nama || "karyawan"}</span>.
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
              <Label>Posisi Penugasan *</Label>
              <Controller
                name="id_posisi"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi" />
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
                <Label htmlFor="edit_hist_tgl_mulai">Tanggal Mulai *</Label>
                <Input
                  id="edit_hist_tgl_mulai"
                  type="date"
                  {...register("tgl_mulai", { required: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit_hist_tgl_selesai">Tanggal Selesai</Label>
                <Input id="edit_hist_tgl_selesai" type="date" {...register("tgl_selesai")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_hist_keterangan">Keterangan Mutasi</Label>
              <Input id="edit_hist_keterangan" {...register("keterangan")} />
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
