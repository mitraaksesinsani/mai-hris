-- ====================================================================
-- SEED DATA UNTUK HRIS PT. MITRA AKSES INSANI (MAI)
-- ====================================================================

-- 1. SEED STATUS KARYAWAN
INSERT INTO public.status_karyawan (id_status, nama_status, keterangan) VALUES
('11111111-1111-1111-1111-111111111111', 'Tetap', 'Karyawan dengan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)'),
('22222222-2222-2222-2222-222222222222', 'Kontrak', 'Karyawan dengan Perjanjian Kerja Waktu Tertentu (PKWT)'),
('33333333-3333-3333-3333-333333333333', 'Probation', 'Masa percobaan 3 bulan'),
('44444444-4444-4444-4444-444444444444', 'Magang', 'Program Internship'),
('55555555-5555-5555-5555-555555555555', 'Non Aktif', 'Karyawan resign atau selesai kontrak')
ON CONFLICT (id_status) DO NOTHING;

-- 2. SEED ORGANISASI (Hierarki Perusahaan PT MAI)
-- Parent: Direksi
INSERT INTO public.organisasi (id_organisasi, nama_organisasi, jenis_organisasi, parent_id) VALUES
('a0000000-0000-0000-0000-000000000001', 'Direksi', 'Direktorat', NULL),
('a0000000-0000-0000-0000-000000000002', 'Divisi Teknologi Informasi', 'Divisi', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000003', 'Divisi Sumber Daya Manusia & Umum', 'Divisi', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000004', 'Divisi Keuangan & Akuntansi', 'Divisi', 'a0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000005', 'Departemen Software Engineering', 'Departemen', 'a0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000006', 'Departemen IT Infrastructure', 'Departemen', 'a0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000007', 'Departemen People & Culture', 'Departemen', 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id_organisasi) DO NOTHING;

-- 3. SEED POSISI
INSERT INTO public.posisi (id_posisi, nama_posisi, level_posisi, id_organisasi) VALUES
('b0000000-0000-0000-0000-000000000001', 'Chief Executive Officer', 'Executive', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'Head of Engineering', 'Head', 'a0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000003', 'Senior Fullstack Engineer', 'Senior', 'a0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000004', 'Frontend Developer', 'Staff', 'a0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000005', 'HR Manager', 'Manager', 'a0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000006', 'People Operations Specialist', 'Staff', 'a0000000-0000-0000-0000-000000000007')
ON CONFLICT (id_posisi) DO NOTHING;

-- 4. SEED JABATAN
INSERT INTO public.jabatan (id_jabatan, nama_jabatan, level_jabatan, id_posisi) VALUES
('c0000000-0000-0000-0000-000000000001', 'Direktur Utama', 'Level 1 - Executive', 'b0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000002', 'Kepala Divisi IT', 'Level 2 - VP/Head', 'b0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000003', 'Tech Lead Engineer', 'Level 3 - Lead', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000004', 'Software Engineer', 'Level 4 - Specialist', 'b0000000-0000-0000-0000-000000000004'),
('c0000000-0000-0000-0000-000000000005', 'Manajer HR & GA', 'Level 2 - Manager', 'b0000000-0000-0000-0000-000000000005'),
('c0000000-0000-0000-0000-000000000006', 'Staff HR & Payroll', 'Level 4 - Officer', 'b0000000-0000-0000-0000-000000000006')
ON CONFLICT (id_jabatan) DO NOTHING;

-- 5. SEED CONTOH DATA KARYAWAN
INSERT INTO public.karyawan (
    id_karyawan, nik, nama, email, no_telp, tempat_lahir, tgl_lahir, jenis_kelamin, agama,
    id_posisi, id_organisasi, id_status, tgl_masuk, role
) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'MAI-2023-001',
    'Ahmad Fauzi, S.Kom',
    'ahmad.fauzi@mitraaksesinsani.co.id',
    '081234567890',
    'Jakarta',
    '1992-05-14',
    'Laki-laki',
    'Islam',
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-111111111111',
    '2023-01-15',
    'admin'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'MAI-2023-002',
    'Siti Rahmawati, S.Psi',
    'siti.rahmawati@mitraaksesinsani.co.id',
    '081298765432',
    'Bandung',
    '1994-08-20',
    'Perempuan',
    'Islam',
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    '2023-02-01',
    'manager'
),
(
    'e0000000-0000-0000-0000-000000000003',
    'MAI-2024-015',
    'Budi Pratama',
    'budi.pratama@mitraaksesinsani.co.id',
    '085612344321',
    'Surabaya',
    '1998-11-10',
    'Laki-laki',
    'Islam',
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    '2024-03-01',
    'employee'
)
ON CONFLICT (id_karyawan) DO NOTHING;

-- 6. SEED ALAMAT
INSERT INTO public.alamat (id_alamat, id_karyawan, jenis_alamat, alamat, kota, provinsi, kode_pos) VALUES
('d0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'KTP', 'Jl. Tebet Barat Dalam No. 12', 'Jakarta Selatan', 'DKI Jakarta', '12810'),
('d0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'Domisili', 'Jl. Rasuna Said Kav. 5, Kuningan', 'Jakarta Selatan', 'DKI Jakarta', '12920'),
('d0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'KTP', 'Jl. Buah Batu No. 45', 'Bandung', 'Jawa Barat', '40265'),
('d0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000003', 'KTP', 'Jl. Manyar Kertoarjo No. 8', 'Surabaya', 'Jawa Timur', '60118')
ON CONFLICT (id_alamat) DO NOTHING;

-- 7. SEED PENDIDIKAN
INSERT INTO public.pendidikan (id_pendidikan, id_karyawan, jenjang, nama_institusi, jurusan, tahun_lulus) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'S1', 'Universitas Indonesia', 'Ilmu Komputer', 2014),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'S1', 'Universitas Padjadjaran', 'Psikologi', 2016),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'S1', 'Institut Teknologi Sepuluh Nopember', 'Sistem Informasi', 2021)
ON CONFLICT (id_pendidikan) DO NOTHING;

-- 8. SEED PENGALAMAN KERJA
INSERT INTO public.pengalaman_kerja (id_pengalaman, id_karyawan, nama_perusahaan, posisi, periode_mulai, periode_selesai, keterangan) VALUES
('10000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'PT. Solusi Digital Nusantara', 'Backend Developer', '2015-02-01', '2019-12-31', 'Pengembangan microservices dan arsitektur database'),
('10000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'PT. Mega Finansial Prima', 'Senior Software Engineer', '2020-01-10', '2022-12-20', 'Lead tim core banking integration')
ON CONFLICT (id_pengalaman) DO NOTHING;

-- 9. SEED RIWAYAT POSISI
INSERT INTO public.riwayat_posisi (id_riwayat_posisi, id_karyawan, id_posisi, tgl_mulai, tgl_selesai, keterangan) VALUES
('20000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', '2023-01-15', '2024-01-14', 'Penempatan awal sebagai Fullstack Developer'),
('20000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', '2024-01-15', NULL, 'Promosi menjadi Senior Fullstack Engineer')
ON CONFLICT (id_riwayat_posisi) DO NOTHING;

-- 10. SEED RIWAYAT GAJI
INSERT INTO public.riwayat_gaji (id_riwayat_gaji, id_karyawan, gaji_pokok, tunjangan, potongan, tgl_mulai, tgl_selesai) VALUES
('30000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 15000000, 3000000, 500000, '2023-01-15', '2024-01-14'),
('30000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 20000000, 4500000, 750000, '2024-01-15', NULL),
('30000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 17000000, 3500000, 600000, '2023-02-01', NULL),
('30000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000003', 9000000, 1500000, 250000, '2024-03-01', NULL)
ON CONFLICT (id_riwayat_gaji) DO NOTHING;
