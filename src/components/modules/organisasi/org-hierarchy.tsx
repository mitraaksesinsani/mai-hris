"use client";

import * as React from "react";
import { useOrganizations, usePositions, useDeleteOrganization } from "@/hooks/use-organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddOrgDialog } from "./add-org-dialog";
import { EditOrgDialog } from "./edit-org-dialog";
import { Organisasi } from "@/types/hris.types";

export function OrgHierarchy() {
  const { data: orgs, isLoading: isOrgLoading } = useOrganizations();
  const { data: positions, isLoading: isPosLoading } = usePositions();
  const deleteOrgMutation = useDeleteOrganization();

  const [selectedOrgToEdit, setSelectedOrgToEdit] = React.useState<Organisasi | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleEdit = (org: Organisasi) => {
    setSelectedOrgToEdit(org);
    setEditOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus unit "${name}" dari struktur organisasi?`)) {
      try {
        await deleteOrgMutation.mutateAsync(id);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus unit organisasi";
        alert(msg);
      }
    }
  };

  if (isOrgLoading || isPosLoading) {
    return <div className="text-center py-10 text-muted-foreground text-xs">Memuat struktur organisasi...</div>;
  }

  // Find root organizations
  const rootOrgs = orgs?.filter((o) => !o.parent_id) || [];
  const childOrgs = orgs?.filter((o) => !!o.parent_id) || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Hierarki Unit Organisasi PT. MAI</h2>
          <p className="text-xs text-muted-foreground">Direktorat, Divisi, Departemen, dan Seksi</p>
        </div>
        <AddOrgDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rootOrgs.map((root) => {
          const children = childOrgs.filter((c) => c.parent_id === root.id_organisasi);
          const rootPositions = positions?.filter((p) => p.id_organisasi === root.id_organisasi) || [];

          return (
            <Card key={root.id_organisasi} className="border-border">
              <CardHeader className="bg-muted/30 border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-foreground" />
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {root.nama_organisasi}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="default" className="text-[10px]">
                      {root.jenis_organisasi}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleEdit(root)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(root.id_organisasi, root.nama_organisasi)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3.5 space-y-3">
                {/* Positions in Root */}
                {rootPositions.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Posisi di Unit Ini
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {rootPositions.map((pos) => (
                        <div
                          key={pos.id_posisi}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
                        >
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span>{pos.nama_posisi}</span>
                          <span className="text-[10px] text-muted-foreground">({pos.level_posisi})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub units */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Sub Divisi / Departemen ({children.length})
                  </p>
                  <div className="space-y-1.5">
                    {children.length > 0 ? (
                      children.map((child) => {
                        const childPositions =
                          positions?.filter((p) => p.id_organisasi === child.id_organisasi) || [];
                        return (
                          <div
                            key={child.id_organisasi}
                            className="rounded-lg border border-border bg-card p-2.5 hover:border-foreground/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-foreground">
                                {child.nama_organisasi}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="text-[10px]">
                                  {child.jenis_organisasi}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => handleEdit(child)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => handleDelete(child.id_organisasi, child.nama_organisasi)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {childPositions.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {childPositions.map((pos) => (
                                  <span
                                    key={pos.id_posisi}
                                    className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-medium"
                                  >
                                    {pos.nama_posisi}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Tidak ada sub-unit di bawah unit ini.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedOrgToEdit && (
        <EditOrgDialog
          org={selectedOrgToEdit}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setSelectedOrgToEdit(null);
          }}
        />
      )}
    </div>
  );
}
