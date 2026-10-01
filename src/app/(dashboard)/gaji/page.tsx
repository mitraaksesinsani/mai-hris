"use client";

import * as React from "react";
import { usePayrolls, useDeleteSalary, PayrollItem } from "@/hooks/use-gaji";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, ShieldAlert, Edit, Trash2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { AddSalaryDialog } from "@/components/modules/gaji/add-salary-dialog";
import { EditSalaryDialog } from "@/components/modules/gaji/edit-salary-dialog";

export default function GajiPage() {
  const { data: salaryRecords = [], isLoading } = usePayrolls();
  const deleteSalaryMutation = useDeleteSalary();

  const [selectedSalToEdit, setSelectedSalToEdit] = React.useState<PayrollItem | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleEdit = (item: PayrollItem) => {
    setSelectedSalToEdit(item);
    setEditOpen(true);
  };

  const handleDelete = async (id: string, employeeName: string) => {
    if (confirm(`Yakin ingin menghapus catatan gaji untuk "${employeeName}"?`)) {
      try {
        await deleteSalaryMutation.mutateAsync(id);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus riwayat gaji";
        alert(msg);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Kompensasi & Riwayat Gaji (Payroll)
            </h1>
            <Badge variant="destructive" className="text-[10px]">
              Confidential / RLS Protected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Data riwayat kompensasi dengan histori perubahan effective date
          </p>
        </div>

        <AddSalaryDialog />
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <span className="font-semibold text-foreground">Keamanan Data Finansial:</span> Modul riwayat gaji diamankan melalui Row Level Security. Seluruh transaksi penyesuaian gaji tersimpan dan terintegrasi langsung dengan database perusahaan.
        </div>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BadgeDollarSign className="h-3.5 w-3.5 text-foreground" />
            Histori Perubahan Gaji Karyawan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Karyawan</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Posisi</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Periode Berlaku</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Gaji Pokok</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Tunjangan</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Potongan</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Take Home Pay</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground text-xs">
                    Memuat riwayat gaji dari database...
                  </TableCell>
                </TableRow>
              ) : salaryRecords.length ? (
                salaryRecords.map((item) => {
                  const thp = Number(item.gaji_pokok) + Number(item.tunjangan) - Number(item.potongan);
                  return (
                    <TableRow key={item.id_riwayat_gaji} className="border-border hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="font-medium text-foreground text-xs">
                          {item.nama || "Karyawan"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.nik || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.nama_posisi || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(item.tgl_mulai)} s/d {item.tgl_selesai ? formatDate(item.tgl_selesai) : "Sekarang"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {formatRupiah(item.gaji_pokok)}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {formatRupiah(item.tunjangan)}
                      </TableCell>
                      <TableCell className="text-xs text-destructive">
                        -{formatRupiah(item.potongan)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold text-foreground">
                        {formatRupiah(thp)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleEdit(item)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDelete(item.id_riwayat_gaji, item.nama || "karyawan")}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground text-xs">
                    Belum ada riwayat slip gaji tercatat di database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSalToEdit && (
        <EditSalaryDialog
          salaryItem={selectedSalToEdit}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setSelectedSalToEdit(null);
          }}
        />
      )}
    </div>
  );
}
