"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { KaryawanWithRelations } from "@/types/hris.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EditEmployeeDialog } from "./edit-employee-dialog";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";

function EmployeeActionsCell({ karyawan }: { karyawan: KaryawanWithRelations }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/karyawan/${karyawan.id_karyawan}`} className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Lihat Detail</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setEditOpen(true)}
          >
            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Data</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus / Non-aktifkan</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditEmployeeDialog
        karyawan={karyawan}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteEmployeeDialog
        karyawan={karyawan}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

export const employeeColumns: ColumnDef<KaryawanWithRelations>[] = [
  {
    accessorKey: "nik",
    header: "NIK",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-foreground">
        {row.getValue("nik")}
      </span>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama Karyawan",
    cell: ({ row }) => {
      const karyawan = row.original;
      const initials = karyawan.nama
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted border border-border text-[11px] font-semibold text-foreground shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <Link
              href={`/karyawan/${karyawan.id_karyawan}`}
              className="font-medium text-foreground hover:underline transition-colors block truncate"
            >
              {karyawan.nama}
            </Link>
            <p className="text-[11px] text-muted-foreground truncate">{karyawan.email || "-"}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "posisi",
    header: "Posisi & Unit",
    cell: ({ row }) => {
      const pos = row.original.posisi?.nama_posisi;
      const org = row.original.organisasi?.nama_organisasi;
      return (
        <div>
          <p className="text-xs font-medium text-foreground">{pos || "-"}</p>
          <p className="text-[11px] text-muted-foreground">{org || "-"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusName = row.original.status?.nama_status;
      if (statusName === "Tetap") {
        return <Badge variant="success">Tetap</Badge>;
      }
      if (statusName === "Kontrak") {
        return <Badge variant="warning">Kontrak</Badge>;
      }
      if (statusName === "Probation") {
        return <Badge variant="purple">Probation</Badge>;
      }
      return <Badge variant="secondary">{statusName || "Lainnya"}</Badge>;
    },
  },
  {
    accessorKey: "tgl_masuk",
    header: "Tgl Masuk",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.getValue("tgl_masuk"))}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role Sistem",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleVariants: Record<string, "default" | "secondary" | "outline"> = {
        admin: "default",
        manager: "secondary",
        employee: "outline",
      };
      return (
        <Badge variant={roleVariants[role] || "outline"} className="capitalize text-[10px]">
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EmployeeActionsCell karyawan={row.original} />,
  },
];
