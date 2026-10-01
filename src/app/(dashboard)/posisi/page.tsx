"use client";

import * as React from "react";
import { usePositions, useOrganizations, useDeletePosition } from "@/hooks/use-organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Edit, Trash2 } from "lucide-react";
import { AddPositionDialog } from "@/components/modules/posisi/add-position-dialog";
import { EditPositionDialog } from "@/components/modules/posisi/edit-position-dialog";
import { Posisi } from "@/types/hris.types";

export default function PosisiPage() {
  const { data: positions = [], isLoading } = usePositions();
  const { data: organizations = [] } = useOrganizations();
  const deletePositionMutation = useDeletePosition();

  const [selectedPosToEdit, setSelectedPosToEdit] = React.useState<Posisi | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const getOrgName = (orgId: string | null) => {
    if (!orgId) return "-";
    return organizations.find((o) => o.id_organisasi === orgId)?.nama_organisasi || "-";
  };

  const handleEdit = (pos: Posisi) => {
    setSelectedPosToEdit(pos);
    setEditOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus posisi "${name}"?`)) {
      try {
        await deletePositionMutation.mutateAsync(id);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus posisi";
        alert(msg);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Master Posisi & Jabatan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar posisi kerja, tingkat level jabatan, dan pemetaan ke unit organisasi
          </p>
        </div>
        <AddPositionDialog />
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-foreground" />
            Daftar Posisi Aktif
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Nama Posisi</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Level Posisi</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Unit Organisasi</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs">
                    Memuat data posisi...
                  </TableCell>
                </TableRow>
              ) : positions.length ? (
                positions.map((pos) => (
                  <TableRow key={pos.id_posisi} className="border-border hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium text-foreground text-xs">
                      {pos.nama_posisi}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {pos.level_posisi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {getOrgName(pos.id_organisasi)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleEdit(pos)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDelete(pos.id_posisi, pos.nama_posisi)}
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
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs">
                    Belum ada data posisi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPosToEdit && (
        <EditPositionDialog
          posisi={selectedPosToEdit}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setSelectedPosToEdit(null);
          }}
        />
      )}
    </div>
  );
}
