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
import { useOrganizations, useUpdateOrganization } from "@/hooks/use-organizations";
import { Organisasi } from "@/types/hris.types";

interface EditOrgDialogProps {
  org: Organisasi;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrgDialog({ org, open, onOpenChange }: EditOrgDialogProps) {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const updateMutation = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nama_organisasi: org.nama_organisasi,
      jenis_organisasi: org.jenis_organisasi,
      parent_id: org.parent_id || "none",
    },
  });

  React.useEffect(() => {
    if (org) {
      reset({
        nama_organisasi: org.nama_organisasi,
        jenis_organisasi: org.jenis_organisasi,
        parent_id: org.parent_id || "none",
      });
    }
  }, [org, reset]);

  const onSubmit = async (data: {
    nama_organisasi: string;
    jenis_organisasi: string;
    parent_id: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        id_organisasi: org.id_organisasi,
        nama_organisasi: data.nama_organisasi,
        jenis_organisasi: data.jenis_organisasi,
        parent_id: data.parent_id === "none" ? null : data.parent_id,
      });
      setSuccessMsg(`Unit "${data.nama_organisasi}" berhasil diperbarui!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui unit";
      alert(msg);
    }
  };

  const potentialParents = orgs?.filter((o) => o.id_organisasi !== org.id_organisasi) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Unit Organisasi
            </DialogTitle>
            <DialogDescription>
              Perbarui rincian nama atau pemetaan relasi hierarki unit.
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
              <Label htmlFor="edit_nama_org">Nama Unit Organisasi *</Label>
              <Input
                id="edit_nama_org"
                {...register("nama_organisasi", { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tingkat / Jenis Unit</Label>
              <Controller
                name="jenis_organisasi"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direktorat">Direktorat</SelectItem>
                      <SelectItem value="Divisi">Divisi</SelectItem>
                      <SelectItem value="Departemen">Departemen</SelectItem>
                      <SelectItem value="Unit">Unit / Seksi</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Unit Induk (Parent Organization)</Label>
              <Controller
                name="parent_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih unit induk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak Ada (Root Unit / Direktorat)</SelectItem>
                      {potentialParents.map((o) => (
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
