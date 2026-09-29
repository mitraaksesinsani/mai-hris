"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useDeleteEmployee } from "@/hooks/use-employees";
import { KaryawanWithRelations } from "@/types/hris.types";

interface DeleteEmployeeDialogProps {
  karyawan: KaryawanWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteEmployeeDialog({
  karyawan,
  open,
  onOpenChange,
  onSuccess,
}: DeleteEmployeeDialogProps) {
  const deleteMutation = useDeleteEmployee();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(karyawan.id_karyawan);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus karyawan";
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Konfirmasi Hapus Karyawan</DialogTitle>
          </div>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data karyawan{" "}
            <span className="font-semibold text-foreground">{karyawan.nama}</span> (NIK:{" "}
            <span className="font-mono text-foreground">{karyawan.nik}</span>)?
            <br />
            <br />
            Tindakan ini akan menghapus seluruh data relasi termasuk riwayat posisi, slip gaji,
            alamat, dan pendidikan dari database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
