"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Organisasi, Posisi } from "@/types/hris.types";
import { MOCK_ORGANISASI, MOCK_POSISI } from "@/lib/mock-data";

export function useOrganizations() {
  return useQuery<Organisasi[]>({
    queryKey: ["organisasi"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/organisasi");
        if (!res.ok) return MOCK_ORGANISASI;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : MOCK_ORGANISASI;
      } catch {
        return MOCK_ORGANISASI;
      }
    },
  });
}

export function usePositions() {
  return useQuery<Posisi[]>({
    queryKey: ["posisi"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/posisi");
        if (!res.ok) return MOCK_POSISI;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : MOCK_POSISI;
      } catch {
        return MOCK_POSISI;
      }
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nama_organisasi: string;
      jenis_organisasi: string;
      parent_id?: string | null;
    }) => {
      const res = await fetch("/api/organisasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat unit organisasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisasi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_organisasi: string;
      nama_organisasi: string;
      jenis_organisasi: string;
      parent_id?: string | null;
    }) => {
      const res = await fetch("/api/organisasi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memperbarui unit organisasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisasi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/organisasi?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus unit organisasi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisasi"] });
      queryClient.invalidateQueries({ queryKey: ["posisi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nama_posisi: string;
      level_posisi: string;
      id_organisasi?: string | null;
    }) => {
      const res = await fetch("/api/posisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat posisi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posisi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id_posisi: string;
      nama_posisi: string;
      level_posisi: string;
      id_organisasi?: string | null;
    }) => {
      const res = await fetch("/api/posisi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memperbarui posisi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posisi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/posisi?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus posisi");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posisi"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}
