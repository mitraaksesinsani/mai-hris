-- ====================================================================
-- HRIS PT. MITRA AKSES INSANI (MAI)
-- Schema Database PostgreSQL & Supabase Migration
-- Fondasi: "Satu ID Karyawan, Satu ID Posisi, Satu Sistem Terintegrasi"
-- ====================================================================

-- 1. EXTENSIONS & HELPER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function untuk auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 2. TABEL MASTER
-- ====================================================================

-- 2.1 TABEL ORGANISASI (Hierarki Divisi / Departemen / Unit)
CREATE TABLE IF NOT EXISTS public.organisasi (
    id_organisasi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_organisasi VARCHAR(150) NOT NULL,
    jenis_organisasi VARCHAR(50) NOT NULL CHECK (jenis_organisasi IN ('Direktorat', 'Divisi', 'Departemen', 'Unit', 'Seksi')),
    parent_id UUID REFERENCES public.organisasi(id_organisasi) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_organisasi_updated_at
BEFORE UPDATE ON public.organisasi
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_organisasi_parent ON public.organisasi(parent_id);

-- 2.2 TABEL POSISI
CREATE TABLE IF NOT EXISTS public.posisi (
    id_posisi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_posisi VARCHAR(150) NOT NULL,
    level_posisi VARCHAR(50) NOT NULL, -- Contoh: Director, Manager, Supervisor, Senior Staff, Staff
    id_organisasi UUID NOT NULL REFERENCES public.organisasi(id_organisasi) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_posisi_updated_at
BEFORE UPDATE ON public.posisi
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_posisi_organisasi ON public.posisi(id_organisasi);

-- 2.3 TABEL JABATAN
CREATE TABLE IF NOT EXISTS public.jabatan (
    id_jabatan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_jabatan VARCHAR(150) NOT NULL,
    level_jabatan VARCHAR(50) NOT NULL,
    id_posisi UUID NOT NULL REFERENCES public.posisi(id_posisi) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_jabatan_updated_at
BEFORE UPDATE ON public.jabatan
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_jabatan_posisi ON public.jabatan(id_posisi);

-- 2.4 TABEL STATUS KARYAWAN
CREATE TABLE IF NOT EXISTS public.status_karyawan (
    id_status UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_status VARCHAR(50) NOT NULL UNIQUE, -- Contoh: Aktif, Kontrak, Probation, Magang, Non Aktif
    keterangan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_status_karyawan_updated_at
BEFORE UPDATE ON public.status_karyawan
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 3. TABEL UTAMA KARYAWAN
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.karyawan (
    id_karyawan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL, -- Menghubungkan ke Supabase Auth
    nik VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    no_telp VARCHAR(30),
    tempat_lahir VARCHAR(100),
    tgl_lahir DATE,
    jenis_kelamin VARCHAR(20) CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    agama VARCHAR(30),
    id_posisi UUID REFERENCES public.posisi(id_posisi) ON DELETE RESTRICT,
    id_organisasi UUID REFERENCES public.organisasi(id_organisasi) ON DELETE RESTRICT,
    id_status UUID NOT NULL REFERENCES public.status_karyawan(id_status) ON DELETE RESTRICT,
    tgl_masuk DATE NOT NULL,
    tgl_keluar DATE, -- NULL jika masih aktif
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
    foto_url TEXT,
    ktp_url TEXT,
    kontrak_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_karyawan_updated_at
BEFORE UPDATE ON public.karyawan
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_karyawan_nik ON public.karyawan(nik);
CREATE INDEX IF NOT EXISTS idx_karyawan_posisi ON public.karyawan(id_posisi);
CREATE INDEX IF NOT EXISTS idx_karyawan_organisasi ON public.karyawan(id_organisasi);
CREATE INDEX IF NOT EXISTS idx_karyawan_status ON public.karyawan(id_status);
CREATE INDEX IF NOT EXISTS idx_karyawan_user_id ON public.karyawan(user_id);

-- ====================================================================
-- 4. TABEL DATA PENDUKUNG KARYAWAN
-- ====================================================================

-- 4.1 TABEL ALAMAT
CREATE TABLE IF NOT EXISTS public.alamat (
    id_alamat UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_karyawan UUID NOT NULL REFERENCES public.karyawan(id_karyawan) ON DELETE CASCADE,
    jenis_alamat VARCHAR(50) NOT NULL CHECK (jenis_alamat IN ('KTP', 'Domisili', 'Kantor', 'Lainnya')),
    alamat TEXT NOT NULL,
    kota VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    kode_pos VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_alamat_updated_at
BEFORE UPDATE ON public.alamat
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_alamat_karyawan ON public.alamat(id_karyawan);

-- 4.2 TABEL PENDIDIKAN
CREATE TABLE IF NOT EXISTS public.pendidikan (
    id_pendidikan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_karyawan UUID NOT NULL REFERENCES public.karyawan(id_karyawan) ON DELETE CASCADE,
    jenjang VARCHAR(50) NOT NULL, -- SMA/SMK, D3, D4, S1, S2, S3
    nama_institusi VARCHAR(150) NOT NULL,
    jurusan VARCHAR(100) NOT NULL,
    tahun_lulus INTEGER NOT NULL CHECK (tahun_lulus >= 1950 AND tahun_lulus <= 2100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_pendidikan_updated_at
BEFORE UPDATE ON public.pendidikan
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_pendidikan_karyawan ON public.pendidikan(id_karyawan);

-- 4.3 TABEL PENGALAMAN KERJA
CREATE TABLE IF NOT EXISTS public.pengalaman_kerja (
    id_pengalaman UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_karyawan UUID NOT NULL REFERENCES public.karyawan(id_karyawan) ON DELETE CASCADE,
    nama_perusahaan VARCHAR(150) NOT NULL,
    posisi VARCHAR(100) NOT NULL,
    periode_mulai DATE NOT NULL,
    periode_selesai DATE,
    keterangan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_pengalaman_updated_at
BEFORE UPDATE ON public.pengalaman_kerja
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_pengalaman_karyawan ON public.pengalaman_kerja(id_karyawan);

-- ====================================================================
-- 5. TABEL HISTORI & TRANSAKSI (Effective Date Tracking)
-- ====================================================================

-- 5.1 TABEL RIWAYAT POSISI
CREATE TABLE IF NOT EXISTS public.riwayat_posisi (
    id_riwayat_posisi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_karyawan UUID NOT NULL REFERENCES public.karyawan(id_karyawan) ON DELETE CASCADE,
    id_posisi UUID NOT NULL REFERENCES public.posisi(id_posisi) ON DELETE RESTRICT,
    tgl_mulai DATE NOT NULL,
    tgl_selesai DATE,
    keterangan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riwayat_posisi_karyawan ON public.riwayat_posisi(id_karyawan);
CREATE INDEX IF NOT EXISTS idx_riwayat_posisi_posisi ON public.riwayat_posisi(id_posisi);

-- 5.2 TABEL RIWAYAT GAJI
CREATE TABLE IF NOT EXISTS public.riwayat_gaji (
    id_riwayat_gaji UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_karyawan UUID NOT NULL REFERENCES public.karyawan(id_karyawan) ON DELETE CASCADE,
    gaji_pokok NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tunjangan NUMERIC(15, 2) NOT NULL DEFAULT 0,
    potongan NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tgl_mulai DATE NOT NULL,
    tgl_selesai DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riwayat_gaji_karyawan ON public.riwayat_gaji(id_karyawan);

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ====================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.organisasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jabatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_karyawan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karyawan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alamat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendidikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengalaman_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_posisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_gaji ENABLE ROW LEVEL SECURITY;

-- Helper functions untuk cek role pengguna yang sedang login
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.karyawan WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_karyawan_id()
RETURNS UUID AS $$
    SELECT id_karyawan FROM public.karyawan WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 6.1 POLICIES TABEL MASTER (Organisasi, Posisi, Jabatan, Status Karyawan)
-- Semua user yang login dapat membaca data master (SELECT)
CREATE POLICY "Semua user terotentikasi dapat melihat organisasi"
    ON public.organisasi FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin & Manager dapat mengelola organisasi"
    ON public.organisasi FOR ALL
    TO authenticated
    USING (public.get_current_role() IN ('admin', 'manager'))
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

CREATE POLICY "Semua user terotentikasi dapat melihat posisi"
    ON public.posisi FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin & Manager dapat mengelola posisi"
    ON public.posisi FOR ALL
    TO authenticated
    USING (public.get_current_role() IN ('admin', 'manager'))
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

CREATE POLICY "Semua user terotentikasi dapat melihat jabatan"
    ON public.jabatan FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin & Manager dapat mengelola jabatan"
    ON public.jabatan FOR ALL
    TO authenticated
    USING (public.get_current_role() IN ('admin', 'manager'))
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

CREATE POLICY "Semua user terotentikasi dapat melihat status karyawan"
    ON public.status_karyawan FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin dapat mengelola status karyawan"
    ON public.status_karyawan FOR ALL
    TO authenticated
    USING (public.get_current_role() = 'admin')
    WITH CHECK (public.get_current_role() = 'admin');

-- 6.2 POLICIES TABEL KARYAWAN
-- Admin & Manager: Full Read, Admin: Full Write
-- Employee: Hanya bisa melihat profile diri sendiri
CREATE POLICY "Akses baca data karyawan"
    ON public.karyawan FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager') 
        OR user_id = auth.uid()
    );

CREATE POLICY "Admin dan Manager dapat insert/update karyawan"
    ON public.karyawan FOR INSERT
    TO authenticated
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

CREATE POLICY "Admin dan Manager dapat update data karyawan"
    ON public.karyawan FOR UPDATE
    TO authenticated
    USING (public.get_current_role() IN ('admin', 'manager'))
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

CREATE POLICY "Hanya Admin yang dapat menghapus data karyawan"
    ON public.karyawan FOR DELETE
    TO authenticated
    USING (public.get_current_role() = 'admin');

-- 6.3 POLICIES DATA PENDUKUNG (Alamat, Pendidikan, Pengalaman Kerja)
-- Alamat
CREATE POLICY "Akses baca alamat"
    ON public.alamat FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

CREATE POLICY "Akses kelola alamat"
    ON public.alamat FOR ALL
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    )
    WITH CHECK (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

-- Pendidikan
CREATE POLICY "Akses baca pendidikan"
    ON public.pendidikan FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

CREATE POLICY "Akses kelola pendidikan"
    ON public.pendidikan FOR ALL
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    )
    WITH CHECK (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

-- Pengalaman Kerja
CREATE POLICY "Akses baca pengalaman"
    ON public.pengalaman_kerja FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

CREATE POLICY "Akses kelola pengalaman"
    ON public.pengalaman_kerja FOR ALL
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    )
    WITH CHECK (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

-- 6.4 POLICIES DATA HISTORI & GAJI
-- Riwayat Posisi: Semua bisa melihat riwayat posisi miliknya atau admin/manager melihat semua
CREATE POLICY "Akses baca riwayat posisi"
    ON public.riwayat_posisi FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() IN ('admin', 'manager')
        OR id_karyawan = public.get_current_karyawan_id()
    );

CREATE POLICY "Kelola riwayat posisi hanya admin & manager"
    ON public.riwayat_posisi FOR ALL
    TO authenticated
    USING (public.get_current_role() IN ('admin', 'manager'))
    WITH CHECK (public.get_current_role() IN ('admin', 'manager'));

-- Riwayat Gaji: SANGAT KETAT (Admin atau Pegawai pemilik data, Manager tanpa hak akses dilarang)
CREATE POLICY "Akses baca riwayat gaji"
    ON public.riwayat_gaji FOR SELECT
    TO authenticated
    USING (
        public.get_current_role() = 'admin'
        OR id_karyawan = public.get_current_karyawan_id()
    );

CREATE POLICY "Kelola riwayat gaji hanya admin"
    ON public.riwayat_gaji FOR ALL
    TO authenticated
    USING (public.get_current_role() = 'admin')
    WITH CHECK (public.get_current_role() = 'admin');

-- ====================================================================
-- 7. SETUP SUPABASE STORAGE (Protected Buckets)
-- ====================================================================

-- Masukkan bucket protected untuk dokumen karyawan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'employee-documents',
    'employee-documents',
    false, -- Private bucket
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Admin dapat mengelola semua file
CREATE POLICY "Admin full access storage employee documents"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        bucket_id = 'employee-documents'
        AND public.get_current_role() = 'admin'
    )
    WITH CHECK (
        bucket_id = 'employee-documents'
        AND public.get_current_role() = 'admin'
    );

-- Policy Storage: Karyawan hanya bisa melihat file dalam foldernya sendiri (misal: /id_karyawan/...)
CREATE POLICY "Karyawan dapat membaca dokumen miliknya"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'employee-documents'
        AND (
            public.get_current_role() IN ('admin', 'manager')
            OR (storage.foldername(name))[1] = public.get_current_karyawan_id()::text
        )
    );

CREATE POLICY "Karyawan dapat mengunggah foto / dokumen miliknya"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'employee-documents'
        AND (
            public.get_current_role() = 'admin'
            OR (storage.foldername(name))[1] = public.get_current_karyawan_id()::text
        )
    );