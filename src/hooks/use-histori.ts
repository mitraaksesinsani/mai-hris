"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiwayatPosisi, Posisi } from "@/types/hris.types";

export interface PositionHistoryItem extends RiwayatPosisi {
  nama?: string;
  nik?: string;
  nama_posisi?: string;
  level_posisi?: string;
  posisi?: Posisi;
}

export function useHistories() {
  return useQuery<PositionHistoryItem[]>({
    queryKey: ["histori"],
    queryFn: async () => {
      const res = await fetch("/api/histori");
      if (!res.ok) throw new Error("Gagal mengambil data riwayat mutasi");
      return await res.json();
    },
  });
}

export function useCreateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_karyawan: string;
      id_posisi: string;
      tgl_mulai: string;
      tgl_selesai?: string | null;
      keterangan?: string | null;
    }) => {
      const res = await fetch("/api/histori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mencatat mutasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histori"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_riwayat_posisi: string;
      id_posisi?: string;
      tgl_mulai?: string;
      tgl_selesai?: string | null;
      keterangan?: string | null;
    }) => {
      const res = await fetch("/api/histori", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memperbarui mutasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histori"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/histori?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus mutasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histori"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}
