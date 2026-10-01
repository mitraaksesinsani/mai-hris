"use client";

import * as React from "react";
import { useHistories, useDeleteHistory, PositionHistoryItem } from "@/hooks/use-histori";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { AddHistoryDialog } from "@/components/modules/histori/add-history-dialog";
import { EditHistoryDialog } from "@/components/modules/histori/edit-history-dialog";

export default function HistoriPage() {
  const { data: histories = [], isLoading } = useHistories();
  const deleteHistoryMutation = useDeleteHistory();

  const [selectedHistToEdit, setSelectedHistToEdit] = React.useState<PositionHistoryItem | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleEdit = (item: PositionHistoryItem) => {
    setSelectedHistToEdit(item);
    setEditOpen(true);
  };

  const handleDelete = async (id: string, employeeName: string) => {
    if (confirm(`Yakin ingin menghapus catatan riwayat mutasi untuk "${employeeName}"?`)) {
      try {
        await deleteHistoryMutation.mutateAsync(id);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus riwayat posisi";
        alert(msg);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Audit Trail & Riwayat Posisi Karyawan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pelacakan promosi, mutasi, dan pergerakan karir internal dengan effective date
          </p>
        </div>
        <AddHistoryDialog />
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-foreground" />
            Log Riwayat Posisi & Mutasi
          </CardTitle>
          <CardDescription className="text-xs">
            Semua rekam jejak mutasi yang tercatat di database PT. MAI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Karyawan</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Posisi Ditugaskan</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Tanggal Mulai</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Tanggal Selesai</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Keterangan Mutasi / Promosi</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-xs">
                    Memuat riwayat posisi dari database...
                  </TableCell>
                </TableRow>
              ) : histories.length ? (
                histories.map((item) => (
                  <TableRow key={item.id_riwayat_posisi} className="border-border hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <div className="font-medium text-foreground text-xs">
                        {item.nama || "Karyawan"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.nik || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <span className="font-medium">{item.nama_posisi || "-"}</span>
                      {item.level_posisi && (
                        <span className="text-[10px] text-muted-foreground ml-1.5">
                          ({item.level_posisi})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.tgl_mulai)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.tgl_selesai ? (
                        formatDate(item.tgl_selesai)
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Aktif Sekarang
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.keterangan || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/karyawan/${item.id_karyawan}`}
                          className="text-xs text-foreground hover:underline inline-flex items-center gap-0.5 mr-1"
                        >
                          <span>Profil</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
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
                          onClick={() => handleDelete(item.id_riwayat_posisi, item.nama || "karyawan")}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-xs">
                    Belum ada riwayat mutasi posisi tercatat di database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedHistToEdit && (
        <EditHistoryDialog
          historyItem={selectedHistToEdit}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setSelectedHistToEdit(null);
          }}
        />
      )}
    </div>
  );
}
