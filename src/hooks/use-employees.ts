"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KaryawanWithRelations } from "@/types/hris.types";
import { CreateEmployeeInput } from "@/lib/validations/employee.schema";
import { MOCK_KARYAWAN } from "@/lib/mock-data";

export function useEmployees(search?: string) {
  return useQuery<KaryawanWithRelations[]>({
    queryKey: ["karyawan", search],
    queryFn: async () => {
      try {
        const url = search ? `/api/karyawan?search=${encodeURIComponent(search)}` : "/api/karyawan";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Gagal mengambil data dari database internal");
        }
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : MOCK_KARYAWAN;
      } catch (err) {
        console.warn("Database fetch fallback:", err);
        return MOCK_KARYAWAN;
      }
    },
  });
}

export function useEmployeeDetail(id: string) {
  return useQuery<KaryawanWithRelations | null>({
    queryKey: ["karyawan", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/karyawan/${id}`);
        if (!res.ok) {
          const fallback = MOCK_KARYAWAN.find((k) => k.id_karyawan === id) || null;
          return fallback;
        }
        return await res.json();
      } catch {
        return MOCK_KARYAWAN.find((k) => k.id_karyawan === id) || null;
      }
    },
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const res = await fetch("/api/karyawan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan data karyawan ke database");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KaryawanWithRelations> }) => {
      const res = await fetch(`/api/karyawan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memperbarui data karyawan");
      }

      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/karyawan/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus karyawan");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useAddAlamat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      data,
    }: {
      id_karyawan: string;
      data: {
        jenis_alamat: string;
        alamat: string;
        kota: string;
        provinsi: string;
        kode_pos: string;
      };
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/alamat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menambahkan alamat");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}

export function useDeleteAlamat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      id_alamat,
    }: {
      id_karyawan: string;
      id_alamat: string;
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/alamat?id_alamat=${id_alamat}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus alamat");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}

export function useAddPendidikan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      data,
    }: {
      id_karyawan: string;
      data: {
        jenjang: string;
        nama_institusi: string;
        jurusan: string;
        tahun_lulus: number;
      };
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/pendidikan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menambahkan riwayat pendidikan");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}

export function useDeletePendidikan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      id_pendidikan,
    }: {
      id_karyawan: string;
      id_pendidikan: string;
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/pendidikan?id_pendidikan=${id_pendidikan}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus riwayat pendidikan");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}

export function useAddPengalaman() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      data,
    }: {
      id_karyawan: string;
      data: {
        nama_perusahaan: string;
        posisi: string;
        periode_mulai: string;
        periode_selesai: string;
        keterangan?: string;
      };
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/pengalaman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menambahkan pengalaman kerja");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}

export function useDeletePengalaman() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_karyawan,
      id_pengalaman,
    }: {
      id_karyawan: string;
      id_pengalaman: string;
    }) => {
      const res = await fetch(`/api/karyawan/${id_karyawan}/pengalaman?id_pengalaman=${id_pengalaman}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus pengalaman kerja");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["karyawan", variables.id_karyawan] });
    },
  });
}
