"use client";

import { useEmployeeDetail } from "@/hooks/use-employees";
import { EmployeeDetailView } from "@/components/modules/karyawan/employee-detail-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function EmployeeDetailClient({ id }: { id: string }) {
  const { data: employee, isLoading } = useEmployeeDetail(id);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Memuat detail data karyawan...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-slate-600 text-sm">Data karyawan tidak ditemukan.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/karyawan">Kembali ke Daftar Karyawan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-slate-500 hover:text-slate-800 -ml-2">
          <Link href="/karyawan">
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Master Karyawan</span>
          </Link>
        </Button>
      </div>

      <EmployeeDetailView karyawan={employee} />
    </div>
  );
}
