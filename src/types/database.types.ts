export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "manager" | "employee";

export interface Database {
  public: {
    Tables: {
      organisasi: {
        Row: {
          id_organisasi: string;
          nama_organisasi: string;
          jenis_organisasi: "Direktorat" | "Divisi" | "Departemen" | "Unit" | "Seksi";
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_organisasi?: string;
          nama_organisasi: string;
          jenis_organisasi: "Direktorat" | "Divisi" | "Departemen" | "Unit" | "Seksi";
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_organisasi?: string;
          nama_organisasi?: string;
          jenis_organisasi?: "Direktorat" | "Divisi" | "Departemen" | "Unit" | "Seksi";
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posisi: {
        Row: {
          id_posisi: string;
          nama_posisi: string;
          level_posisi: string;
          id_organisasi: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_posisi?: string;
          nama_posisi: string;
          level_posisi: string;
          id_organisasi: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_posisi?: string;
          nama_posisi?: string;
          level_posisi?: string;
          id_organisasi?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      jabatan: {
        Row: {
          id_jabatan: string;
          nama_jabatan: string;
          level_jabatan: string;
          id_posisi: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_jabatan?: string;
          nama_jabatan: string;
          level_jabatan: string;
          id_posisi: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_jabatan?: string;
          nama_jabatan?: string;
          level_jabatan?: string;
          id_posisi?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      status_karyawan: {
        Row: {
          id_status: string;
          nama_status: string;
          keterangan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_status?: string;
          nama_status: string;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_status?: string;
          nama_status?: string;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      karyawan: {
        Row: {
          id_karyawan: string;
          user_id: string | null;
          nik: string;
          nama: string;
          email: string | null;
          no_telp: string | null;
          tempat_lahir: string | null;
          tgl_lahir: string | null;
          jenis_kelamin: "Laki-laki" | "Perempuan" | null;
          agama: string | null;
          id_posisi: string | null;
          id_organisasi: string | null;
          id_status: string;
          tgl_masuk: string;
          tgl_keluar: string | null;
          role: UserRole;
          foto_url: string | null;
          ktp_url: string | null;
          kontrak_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_karyawan?: string;
          user_id?: string | null;
          nik: string;
          nama: string;
          email?: string | null;
          no_telp?: string | null;
          tempat_lahir?: string | null;
          tgl_lahir?: string | null;
          jenis_kelamin?: "Laki-laki" | "Perempuan" | null;
          agama?: string | null;
          id_posisi?: string | null;
          id_organisasi?: string | null;
          id_status: string;
          tgl_masuk: string;
          tgl_keluar?: string | null;
          role?: UserRole;
          foto_url?: string | null;
          ktp_url?: string | null;
          kontrak_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_karyawan?: string;
          user_id?: string | null;
          nik?: string;
          nama?: string;
          email?: string | null;
          no_telp?: string | null;
          tempat_lahir?: string | null;
          tgl_lahir?: string | null;
          jenis_kelamin?: "Laki-laki" | "Perempuan" | null;
          agama?: string | null;
          id_posisi?: string | null;
          id_organisasi?: string | null;
          id_status?: string;
          tgl_masuk?: string;
          tgl_keluar?: string | null;
          role?: UserRole;
          foto_url?: string | null;
          ktp_url?: string | null;
          kontrak_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      alamat: {
        Row: {
          id_alamat: string;
          id_karyawan: string;
          jenis_alamat: "KTP" | "Domisili" | "Kantor" | "Lainnya";
          alamat: string;
          kota: string;
          provinsi: string;
          kode_pos: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_alamat?: string;
          id_karyawan: string;
          jenis_alamat: "KTP" | "Domisili" | "Kantor" | "Lainnya";
          alamat: string;
          kota: string;
          provinsi: string;
          kode_pos: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_alamat?: string;
          id_karyawan?: string;
          jenis_alamat?: "KTP" | "Domisili" | "Kantor" | "Lainnya";
          alamat?: string;
          kota?: string;
          provinsi?: string;
          kode_pos?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pendidikan: {
        Row: {
          id_pendidikan: string;
          id_karyawan: string;
          jenjang: string;
          nama_institusi: string;
          jurusan: string;
          tahun_lulus: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_pendidikan?: string;
          id_karyawan: string;
          jenjang: string;
          nama_institusi: string;
          jurusan: string;
          tahun_lulus: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_pendidikan?: string;
          id_karyawan?: string;
          jenjang?: string;
          nama_institusi?: string;
          jurusan?: string;
          tahun_lulus?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      pengalaman_kerja: {
        Row: {
          id_pengalaman: string;
          id_karyawan: string;
          nama_perusahaan: string;
          posisi: string;
          periode_mulai: string;
          periode_selesai: string | null;
          keterangan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id_pengalaman?: string;
          id_karyawan: string;
          nama_perusahaan: string;
          posisi: string;
          periode_mulai: string;
          periode_selesai?: string | null;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id_pengalaman?: string;
          id_karyawan?: string;
          nama_perusahaan?: string;
          posisi?: string;
          periode_mulai?: string;
          periode_selesai?: string | null;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      riwayat_posisi: {
        Row: {
          id_riwayat_posisi: string;
          id_karyawan: string;
          id_posisi: string;
          tgl_mulai: string;
          tgl_selesai: string | null;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id_riwayat_posisi?: string;
          id_karyawan: string;
          id_posisi: string;
          tgl_mulai: string;
          tgl_selesai?: string | null;
          keterangan?: string | null;
          created_at?: string;
        };
        Update: {
          id_riwayat_posisi?: string;
          id_karyawan?: string;
          id_posisi?: string;
          tgl_mulai?: string;
          tgl_selesai?: string | null;
          keterangan?: string | null;
          created_at?: string;
        };
      };
      riwayat_gaji: {
        Row: {
          id_riwayat_gaji: string;
          id_karyawan: string;
          gaji_pokok: number;
          tunjangan: number;
          potongan: number;
          tgl_mulai: string;
          tgl_selesai: string | null;
          created_at: string;
        };
        Insert: {
          id_riwayat_gaji?: string;
          id_karyawan: string;
          gaji_pokok?: number;
          tunjangan?: number;
          potongan?: number;
          tgl_mulai: string;
          tgl_selesai?: string | null;
          created_at?: string;
        };
        Update: {
          id_riwayat_gaji?: string;
          id_karyawan?: string;
          gaji_pokok?: number;
          tunjangan?: number;
          potongan?: number;
          tgl_mulai?: string;
          tgl_selesai?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_current_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_current_karyawan_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
  };
}
