"use client";

import { useEmployees } from "@/hooks/use-employees";
import { EmployeeTable } from "@/components/modules/karyawan/employee-table";
import { Badge } from "@/components/ui/badge";

export default function KaryawanPage() {
  const { data: employees = [], isLoading } = useEmployees();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Data Master Karyawan
            </h1>
            <Badge variant="secondary" className="text-xs font-mono">
              {employees.length} Orang
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Data karyawan terintegrasi dengan Posisi, Unit Organisasi, dan Status Kepegawaian PT. MAI
          </p>
        </div>
      </div>

      {/* TanStack Table Component */}
      <EmployeeTable data={employees} isLoading={isLoading} />
    </div>
  );
}
