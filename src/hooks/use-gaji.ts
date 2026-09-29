"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiwayatGaji } from "@/types/hris.types";

export interface PayrollItem extends RiwayatGaji {
  nama?: string;
  nik?: string;
  nama_posisi?: string;
  nama_organisasi?: string;
}

export function usePayrolls() {
  return useQuery<PayrollItem[]>({
    queryKey: ["gaji"],
    queryFn: async () => {
      const res = await fetch("/api/gaji");
      if (!res.ok) throw new Error("Gagal mengambil data riwayat gaji");
      return await res.json();
    },
  });
}

export function useCreateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_karyawan: string;
      gaji_pokok: number;
      tunjangan: number;
      potongan: number;
      tgl_mulai: string;
      tgl_selesai?: string | null;
    }) => {
      const res = await fetch("/api/gaji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mencatat data gaji");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gaji"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_riwayat_gaji: string;
      gaji_pokok?: number;
      tunjangan?: number;
      potongan?: number;
      tgl_mulai?: string;
      tgl_selesai?: string | null;
    }) => {
      const res = await fetch("/api/gaji", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memperbarui data gaji");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gaji"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useDeleteSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gaji?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus data gaji");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gaji"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}
