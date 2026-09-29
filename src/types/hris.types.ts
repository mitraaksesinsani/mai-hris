import { Database } from "./database.types";

export type Organisasi = Database["public"]["Tables"]["organisasi"]["Row"];
export type Posisi = Database["public"]["Tables"]["posisi"]["Row"];
export type Jabatan = Database["public"]["Tables"]["jabatan"]["Row"];
export type StatusKaryawan = Database["public"]["Tables"]["status_karyawan"]["Row"];
export type Karyawan = Database["public"]["Tables"]["karyawan"]["Row"];
export type Alamat = Database["public"]["Tables"]["alamat"]["Row"];
export type Pendidikan = Database["public"]["Tables"]["pendidikan"]["Row"];
export type PengalamanKerja = Database["public"]["Tables"]["pengalaman_kerja"]["Row"];
export type RiwayatPosisi = Database["public"]["Tables"]["riwayat_posisi"]["Row"];
export type RiwayatGaji = Database["public"]["Tables"]["riwayat_gaji"]["Row"];

// Extended types for joined queries
export interface KaryawanWithRelations extends Karyawan {
  posisi?: Posisi | null;
  organisasi?: Organisasi | null;
  status?: StatusKaryawan | null;
  alamat?: Alamat[];
  pendidikan?: Pendidikan[];
  pengalaman?: PengalamanKerja[];
  riwayat_posisi?: (RiwayatPosisi & { posisi?: Posisi })[];
  riwayat_gaji?: RiwayatGaji[];
}

export interface OrganisasiTreeNode extends Organisasi {
  children?: OrganisasiTreeNode[];
  positions?: (Posisi & { jabatans?: Jabatan[] })[];
  totalKaryawan?: number;
}
