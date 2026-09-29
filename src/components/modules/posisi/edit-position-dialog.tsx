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
import { useOrganizations, useUpdatePosition } from "@/hooks/use-organizations";
import { Posisi } from "@/types/hris.types";

interface EditPositionDialogProps {
  posisi: Posisi;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPositionDialog({ posisi, open, onOpenChange }: EditPositionDialogProps) {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const updateMutation = useUpdatePosition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nama_posisi: posisi.nama_posisi,
      level_posisi: posisi.level_posisi,
      id_organisasi: posisi.id_organisasi || "",
    },
  });

  React.useEffect(() => {
    if (posisi) {
      reset({
        nama_posisi: posisi.nama_posisi,
        level_posisi: posisi.level_posisi,
        id_organisasi: posisi.id_organisasi || "",
      });
    }
  }, [posisi, reset]);

  const onSubmit = async (data: {
    nama_posisi: string;
    level_posisi: string;
    id_organisasi: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        id_posisi: posisi.id_posisi,
        nama_posisi: data.nama_posisi,
        level_posisi: data.level_posisi,
        id_organisasi: data.id_organisasi || null,
      });
      setSuccessMsg(`Posisi "${data.nama_posisi}" berhasil diperbarui!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui posisi";
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
              Edit Data Posisi
            </DialogTitle>
            <DialogDescription>
              Perbarui rincian nama, level tingkatan, atau unit organisasi terkait.
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
              <Label htmlFor="edit_nama_pos">Nama Posisi *</Label>
              <Input
                id="edit_nama_pos"
                {...register("nama_posisi", { required: true })}
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
                      <SelectItem value="Executive">Executive</SelectItem>
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
              <Label>Unit Organisasi</Label>
              <Controller
                name="id_organisasi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
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
