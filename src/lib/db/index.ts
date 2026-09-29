import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "hris.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initTablesAndSeed(db);
  dbInstance = db;
  return dbInstance;
}

function initTablesAndSeed(db: Database.Database) {
  // 1. Create 10 Tables matching the ERD
  db.exec(`
    CREATE TABLE IF NOT EXISTS status_karyawan (
      id_status TEXT PRIMARY KEY,
      nama_status TEXT NOT NULL,
      keterangan TEXT
    );

    CREATE TABLE IF NOT EXISTS organisasi (
      id_organisasi TEXT PRIMARY KEY,
      nama_organisasi TEXT NOT NULL,
      jenis_organisasi TEXT NOT NULL,
      parent_id TEXT REFERENCES organisasi(id_organisasi)
    );

    CREATE TABLE IF NOT EXISTS posisi (
      id_posisi TEXT PRIMARY KEY,
      nama_posisi TEXT NOT NULL,
      level_posisi TEXT NOT NULL,
      id_organisasi TEXT REFERENCES organisasi(id_organisasi)
    );

    CREATE TABLE IF NOT EXISTS jabatan (
      id_jabatan TEXT PRIMARY KEY,
      nama_jabatan TEXT NOT NULL,
      level_jabatan TEXT NOT NULL,
      id_posisi TEXT REFERENCES posisi(id_posisi)
    );

    CREATE TABLE IF NOT EXISTS karyawan (
      id_karyawan TEXT PRIMARY KEY,
      nik TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      no_telp TEXT,
      tempat_lahir TEXT,
      tgl_lahir TEXT,
      jenis_kelamin TEXT,
      agama TEXT,
      role TEXT DEFAULT 'employee',
      id_posisi TEXT REFERENCES posisi(id_posisi),
      id_organisasi TEXT REFERENCES organisasi(id_organisasi),
      id_status TEXT REFERENCES status_karyawan(id_status),
      tgl_masuk TEXT NOT NULL,
      tgl_keluar TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS alamat (
      id_alamat TEXT PRIMARY KEY,
      id_karyawan TEXT NOT NULL REFERENCES karyawan(id_karyawan) ON DELETE CASCADE,
      jenis_alamat TEXT NOT NULL,
      alamat TEXT NOT NULL,
      kota TEXT NOT NULL,
      provinsi TEXT NOT NULL,
      kode_pos TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pendidikan (
      id_pendidikan TEXT PRIMARY KEY,
      id_karyawan TEXT NOT NULL REFERENCES karyawan(id_karyawan) ON DELETE CASCADE,
      jenjang TEXT NOT NULL,
      nama_institusi TEXT NOT NULL,
      jurusan TEXT NOT NULL,
      tahun_lulus INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pengalaman_kerja (
      id_pengalaman TEXT PRIMARY KEY,
      id_karyawan TEXT NOT NULL REFERENCES karyawan(id_karyawan) ON DELETE CASCADE,
      nama_perusahaan TEXT NOT NULL,
      posisi TEXT NOT NULL,
      periode_mulai TEXT NOT NULL,
      periode_selesai TEXT NOT NULL,
      keterangan TEXT
    );

    CREATE TABLE IF NOT EXISTS riwayat_posisi (
      id_riwayat_posisi TEXT PRIMARY KEY,
      id_karyawan TEXT NOT NULL REFERENCES karyawan(id_karyawan) ON DELETE CASCADE,
      id_posisi TEXT NOT NULL REFERENCES posisi(id_posisi),
      tgl_mulai TEXT NOT NULL,
      tgl_selesai TEXT,
      keterangan TEXT
    );

    CREATE TABLE IF NOT EXISTS riwayat_gaji (
      id_riwayat_gaji TEXT PRIMARY KEY,
      id_karyawan TEXT NOT NULL REFERENCES karyawan(id_karyawan) ON DELETE CASCADE,
      gaji_pokok NUMERIC NOT NULL,
      tunjangan NUMERIC NOT NULL,
      potongan NUMERIC NOT NULL,
      tgl_mulai TEXT NOT NULL,
      tgl_selesai TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',
      id_karyawan TEXT REFERENCES karyawan(id_karyawan)
    );
  `);

  // 2. Check if already seeded
  const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const seedTransaction = db.transaction(() => {
      // Seed Admin User (user: admin, password: 123)
      db.prepare(`
        INSERT INTO users (id, username, email, password, name, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        "u0000000-0000-0000-0000-000000000001",
        "admin",
        "admin@mitraaksesinsani.co.id",
        "123",
        "Administrator MAI",
        "admin"
      );

      // Seed Status
      const insertStatus = db.prepare("INSERT INTO status_karyawan (id_status, nama_status, keterangan) VALUES (?, ?, ?)");
      insertStatus.run("11111111-1111-1111-1111-111111111111", "Tetap", "Karyawan dengan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)");
      insertStatus.run("22222222-2222-2222-2222-222222222222", "Kontrak", "Karyawan dengan Perjanjian Kerja Waktu Tertentu (PKWT)");
      insertStatus.run("33333333-3333-3333-3333-333333333333", "Probation", "Masa percobaan 3 bulan");
      insertStatus.run("44444444-4444-4444-4444-444444444444", "Magang", "Program Internship");
      insertStatus.run("55555555-5555-5555-5555-555555555555", "Non Aktif", "Karyawan resign atau selesai kontrak");

      // Seed Organisasi
      const insertOrg = db.prepare("INSERT INTO organisasi (id_organisasi, nama_organisasi, jenis_organisasi, parent_id) VALUES (?, ?, ?, ?)");
      insertOrg.run("a0000000-0000-0000-0000-000000000001", "Direksi", "Direktorat", null);
      insertOrg.run("a0000000-0000-0000-0000-000000000002", "Divisi Teknologi Informasi", "Divisi", "a0000000-0000-0000-0000-000000000001");
      insertOrg.run("a0000000-0000-0000-0000-000000000003", "Divisi Sumber Daya Manusia & Umum", "Divisi", "a0000000-0000-0000-0000-000000000001");
      insertOrg.run("a0000000-0000-0000-0000-000000000004", "Divisi Keuangan & Akuntansi", "Divisi", "a0000000-0000-0000-0000-000000000001");
      insertOrg.run("a0000000-0000-0000-0000-000000000005", "Departemen Software Engineering", "Departemen", "a0000000-0000-0000-0000-000000000002");
      insertOrg.run("a0000000-0000-0000-0000-000000000006", "Departemen IT Infrastructure", "Departemen", "a0000000-0000-0000-0000-000000000002");
      insertOrg.run("a0000000-0000-0000-0000-000000000007", "Departemen People & Culture", "Departemen", "a0000000-0000-0000-0000-000000000003");

      // Seed Posisi
      const insertPos = db.prepare("INSERT INTO posisi (id_posisi, nama_posisi, level_posisi, id_organisasi) VALUES (?, ?, ?, ?)");
      insertPos.run("b0000000-0000-0000-0000-000000000001", "Chief Executive Officer", "Executive", "a0000000-0000-0000-0000-000000000001");
      insertPos.run("b0000000-0000-0000-0000-000000000002", "Head of Engineering", "Head", "a0000000-0000-0000-0000-000000000002");
      insertPos.run("b0000000-0000-0000-0000-000000000003", "Senior Fullstack Engineer", "Senior", "a0000000-0000-0000-0000-000000000005");
      insertPos.run("b0000000-0000-0000-0000-000000000004", "Frontend Developer", "Staff", "a0000000-0000-0000-0000-000000000005");
      insertPos.run("b0000000-0000-0000-0000-000000000005", "HR Manager", "Manager", "a0000000-0000-0000-0000-000000000003");
      insertPos.run("b0000000-0000-0000-0000-000000000006", "People Operations Specialist", "Staff", "a0000000-0000-0000-0000-000000000007");

      // Seed Jabatan
      const insertJab = db.prepare("INSERT INTO jabatan (id_jabatan, nama_jabatan, level_jabatan, id_posisi) VALUES (?, ?, ?, ?)");
      insertJab.run("c0000000-0000-0000-0000-000000000001", "Direktur Utama", "Level 1 - Executive", "b0000000-0000-0000-0000-000000000001");
      insertJab.run("c0000000-0000-0000-0000-000000000002", "Kepala Divisi IT", "Level 2 - VP/Head", "b0000000-0000-0000-0000-000000000002");
      insertJab.run("c0000000-0000-0000-0000-000000000003", "Tech Lead Engineer", "Level 3 - Lead", "b0000000-0000-0000-0000-000000000003");
      insertJab.run("c0000000-0000-0000-0000-000000000004", "Software Engineer", "Level 4 - Specialist", "b0000000-0000-0000-0000-000000000004");
      insertJab.run("c0000000-0000-0000-0000-000000000005", "Manajer HR & GA", "Level 2 - Manager", "b0000000-0000-0000-0000-000000000005");
      insertJab.run("c0000000-0000-0000-0000-000000000006", "Staff HR & Payroll", "Level 4 - Officer", "b0000000-0000-0000-0000-000000000006");

      // Seed Karyawan
      const insertKar = db.prepare(`
        INSERT INTO karyawan (
          id_karyawan, nik, nama, email, no_telp, tempat_lahir, tgl_lahir, jenis_kelamin, agama,
          id_posisi, id_organisasi, id_status, tgl_masuk, role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertKar.run(
        "e0000000-0000-0000-0000-000000000001",
        "MAI-2023-001",
        "Ahmad Fauzi, S.Kom",
        "ahmad.fauzi@mitraaksesinsani.co.id",
        "081234567890",
        "Jakarta",
        "1992-05-14",
        "Laki-laki",
        "Islam",
        "b0000000-0000-0000-0000-000000000003",
        "a0000000-0000-0000-0000-000000000005",
        "11111111-1111-1111-1111-111111111111",
        "2023-01-15",
        "admin"
      );
      insertKar.run(
        "e0000000-0000-0000-0000-000000000002",
        "MAI-2023-002",
        "Siti Rahmawati, S.Psi",
        "siti.rahmawati@mitraaksesinsani.co.id",
        "081298765432",
        "Bandung",
        "1994-08-20",
        "Perempuan",
        "Islam",
        "b0000000-0000-0000-0000-000000000005",
        "a0000000-0000-0000-0000-000000000003",
        "11111111-1111-1111-1111-111111111111",
        "2023-02-01",
        "manager"
      );
      insertKar.run(
        "e0000000-0000-0000-0000-000000000003",
        "MAI-2024-015",
        "Budi Pratama",
        "budi.pratama@mitraaksesinsani.co.id",
        "085612344321",
        "Surabaya",
        "1998-11-10",
        "Laki-laki",
        "Islam",
        "b0000000-0000-0000-0000-000000000004",
        "a0000000-0000-0000-0000-000000000005",
        "22222222-2222-2222-2222-222222222222",
        "2024-03-01",
        "employee"
      );

      // Seed Alamat
      const insertAlamat = db.prepare("INSERT INTO alamat (id_alamat, id_karyawan, jenis_alamat, alamat, kota, provinsi, kode_pos) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertAlamat.run("d0000000-0000-0000-0000-000000000001", "e0000000-0000-0000-0000-000000000001", "KTP", "Jl. Tebet Barat Dalam No. 12", "Jakarta Selatan", "DKI Jakarta", "12810");
      insertAlamat.run("d0000000-0000-0000-0000-000000000002", "e0000000-0000-0000-0000-000000000001", "Domisili", "Jl. Rasuna Said Kav. 5, Kuningan", "Jakarta Selatan", "DKI Jakarta", "12920");
      insertAlamat.run("d0000000-0000-0000-0000-000000000003", "e0000000-0000-0000-0000-000000000002", "KTP", "Jl. Buah Batu No. 45", "Bandung", "Jawa Barat", "40265");
      insertAlamat.run("d0000000-0000-0000-0000-000000000004", "e0000000-0000-0000-0000-000000000003", "KTP", "Jl. Manyar Kertoarjo No. 8", "Surabaya", "Jawa Timur", "60118");

      // Seed Pendidikan
      const insertPend = db.prepare("INSERT INTO pendidikan (id_pendidikan, id_karyawan, jenjang, nama_institusi, jurusan, tahun_lulus) VALUES (?, ?, ?, ?, ?, ?)");
      insertPend.run("f0000000-0000-0000-0000-000000000001", "e0000000-0000-0000-0000-000000000001", "S1", "Universitas Indonesia", "Ilmu Komputer", 2014);
      insertPend.run("f0000000-0000-0000-0000-000000000002", "e0000000-0000-0000-0000-000000000002", "S1", "Universitas Padjadjaran", "Psikologi", 2016);
      insertPend.run("f0000000-0000-0000-0000-000000000003", "e0000000-0000-0000-0000-000000000003", "S1", "Institut Teknologi Sepuluh Nopember", "Sistem Informasi", 2021);

      // Seed Pengalaman
      const insertPeng = db.prepare("INSERT INTO pengalaman_kerja (id_pengalaman, id_karyawan, nama_perusahaan, posisi, periode_mulai, periode_selesai, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertPeng.run("10000000-0000-0000-0000-000000000001", "e0000000-0000-0000-0000-000000000001", "PT. Solusi Digital Nusantara", "Backend Developer", "2015-02-01", "2019-12-31", "Pengembangan microservices dan arsitektur database");
      insertPeng.run("10000000-0000-0000-0000-000000000002", "e0000000-0000-0000-0000-000000000001", "PT. Mega Finansial Prima", "Senior Software Engineer", "2020-01-10", "2022-12-20", "Lead tim core banking integration");

      // Seed Riwayat Posisi
      const insertRiwPos = db.prepare("INSERT INTO riwayat_posisi (id_riwayat_posisi, id_karyawan, id_posisi, tgl_mulai, tgl_selesai, keterangan) VALUES (?, ?, ?, ?, ?, ?)");
      insertRiwPos.run("20000000-0000-0000-0000-000000000001", "e0000000-0000-0000-0000-000000000001", "b0000000-0000-0000-0000-000000000004", "2023-01-15", "2024-01-14", "Penempatan awal sebagai Fullstack Developer");
      insertRiwPos.run("20000000-0000-0000-0000-000000000002", "e0000000-0000-0000-0000-000000000001", "b0000000-0000-0000-0000-000000000003", "2024-01-15", null, "Promosi menjadi Senior Fullstack Engineer");

      // Seed Riwayat Gaji
      const insertGaji = db.prepare("INSERT INTO riwayat_gaji (id_riwayat_gaji, id_karyawan, gaji_pokok, tunjangan, potongan, tgl_mulai, tgl_selesai) VALUES (?, ?, ?, ?, ?, ?, ?)");
      insertGaji.run("30000000-0000-0000-0000-000000000001", "e0000000-0000-0000-0000-000000000001", 15000000, 3000000, 500000, "2023-01-15", "2024-01-14");
      insertGaji.run("30000000-0000-0000-0000-000000000002", "e0000000-0000-0000-0000-000000000001", 20000000, 4500000, 750000, "2024-01-15", null);
      insertGaji.run("30000000-0000-0000-0000-000000000003", "e0000000-0000-0000-0000-000000000002", 17000000, 3500000, 600000, "2023-02-01", null);
      insertGaji.run("30000000-0000-0000-0000-000000000004", "e0000000-0000-0000-0000-000000000003", 9000000, 1500000, 250000, "2024-03-01", null);
    });
    seedTransaction();
  }
}
