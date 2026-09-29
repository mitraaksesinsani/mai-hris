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
import { Building2, Plus, CheckCircle2 } from "lucide-react";
import { useOrganizations, useCreateOrganization } from "@/hooks/use-organizations";

export function AddOrgDialog() {
  const [open, setOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const { data: orgs } = useOrganizations();
  const createMutation = useCreateOrganization();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nama_organisasi: "",
      jenis_organisasi: "Divisi",
      parent_id: "none",
    },
  });

  const onSubmit = async (data: {
    nama_organisasi: string;
    jenis_organisasi: string;
    parent_id: string;
  }) => {
    try {
      await createMutation.mutateAsync({
        nama_organisasi: data.nama_organisasi,
        jenis_organisasi: data.jenis_organisasi,
        parent_id: data.parent_id === "none" ? null : data.parent_id,
      });
      setSuccessMsg(`Unit "${data.nama_organisasi}" berhasil ditambahkan!`);
      setTimeout(() => {
        reset();
        setSuccessMsg(null);
        setOpen(false);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan unit";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Unit / Divisi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Tambah Unit Organisasi
            </DialogTitle>
            <DialogDescription>
              Tambahkan Direktorat, Divisi, Departemen, atau Seksi ke struktur MAI.
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
              <Label htmlFor="nama_org">Nama Unit Organisasi *</Label>
              <Input
                id="nama_org"
                {...register("nama_organisasi", { required: true })}
                placeholder="Contoh: Divisi Operasional"
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
                      <SelectItem value="Direktorat">Direktorat (Tingkat Tertinggi)</SelectItem>
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
                      <SelectValue placeholder="Pilih unit induk jika ada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak Ada (Root Unit / Direktorat)</SelectItem>
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
              {isSubmitting ? "Menyimpan..." : "Simpan Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
