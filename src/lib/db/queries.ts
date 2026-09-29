import { getDatabase } from "./index";
import { KaryawanWithRelations } from "@/types/hris.types";
import crypto from "crypto";

export function getEmployees(search?: string): KaryawanWithRelations[] {
  const db = getDatabase();

  let query = `
    SELECT 
      k.*,
      p.id_posisi as "pos_id", p.nama_posisi as "pos_nama", p.level_posisi as "pos_level", p.id_organisasi as "pos_org_id",
      o.id_organisasi as "org_id", o.nama_organisasi as "org_nama", o.jenis_organisasi as "org_jenis", o.parent_id as "org_parent",
      s.id_status as "stat_id", s.nama_status as "stat_nama", s.keterangan as "stat_ket"
    FROM karyawan k
    LEFT JOIN posisi p ON k.id_posisi = p.id_posisi
    LEFT JOIN organisasi o ON k.id_organisasi = o.id_organisasi
    LEFT JOIN status_karyawan s ON k.id_status = s.id_status
  `;

  const params: unknown[] = [];
  if (search && search.trim()) {
    query += ` WHERE k.nama LIKE ? OR k.nik LIKE ? OR k.email LIKE ?`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  query += ` ORDER BY k.created_at DESC`;

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];

  return rows.map((r) => {
    const id = r.id_karyawan as string;
    const alamat = db.prepare("SELECT * FROM alamat WHERE id_karyawan = ?").all(id);
    const pendidikan = db.prepare("SELECT * FROM pendidikan WHERE id_karyawan = ?").all(id);
    const pengalaman = db.prepare("SELECT * FROM pengalaman_kerja WHERE id_karyawan = ?").all(id);
    const riwayat_posisi = db.prepare(`
      SELECT rp.*, p.nama_posisi, p.level_posisi 
      FROM riwayat_posisi rp
      LEFT JOIN posisi p ON rp.id_posisi = p.id_posisi
      WHERE rp.id_karyawan = ?
      ORDER BY rp.tgl_mulai DESC
    `).all(id);
    const riwayat_gaji = db.prepare("SELECT * FROM riwayat_gaji WHERE id_karyawan = ? ORDER BY tgl_mulai DESC").all(id);

    return {
      id_karyawan: r.id_karyawan as string,
      nik: r.nik as string,
      nama: r.nama as string,
      email: r.email as string,
      no_telp: r.no_telp as string | null,
      tempat_lahir: r.tempat_lahir as string | null,
      tgl_lahir: r.tgl_lahir as string | null,
      jenis_kelamin: r.jenis_kelamin as "Laki-laki" | "Perempuan" | null,
      agama: r.agama as string | null,
      foto_url: null,
      ktp_url: null,
      kontrak_url: null,
      id_posisi: r.id_posisi as string,
      id_organisasi: r.id_organisasi as string,
      id_status: r.id_status as string,
      tgl_masuk: r.tgl_masuk as string,
      tgl_keluar: r.tgl_keluar as string | null,
      role: (r.role || "employee") as "admin" | "manager" | "employee",
      user_id: null,
      created_at: r.created_at as string,
      updated_at: r.created_at as string,
      posisi: r.pos_id
        ? {
            id_posisi: r.pos_id as string,
            nama_posisi: r.pos_nama as string,
            level_posisi: r.pos_level as string,
            id_organisasi: r.pos_org_id as string,
            created_at: "",
            updated_at: "",
          }
        : null,
      organisasi: r.org_id
        ? {
            id_organisasi: r.org_id as string,
            nama_organisasi: r.org_nama as string,
            jenis_organisasi: r.org_jenis as "Direktorat" | "Divisi" | "Departemen" | "Unit",
            parent_id: r.org_parent as string | null,
            created_at: "",
            updated_at: "",
          }
        : null,
      status: r.stat_id
        ? {
            id_status: r.stat_id as string,
            nama_status: r.stat_nama as "Tetap" | "Kontrak" | "Probation" | "Magang" | "Non Aktif",
            keterangan: r.stat_ket as string | null,
            created_at: "",
            updated_at: "",
          }
        : null,
      alamat: alamat as unknown as KaryawanWithRelations["alamat"],
      pendidikan: pendidikan as unknown as KaryawanWithRelations["pendidikan"],
      pengalaman: pengalaman as unknown as KaryawanWithRelations["pengalaman"],
      riwayat_posisi: riwayat_posisi as unknown as KaryawanWithRelations["riwayat_posisi"],
      riwayat_gaji: riwayat_gaji as unknown as KaryawanWithRelations["riwayat_gaji"],
    };
  });
}

export function getEmployeeById(id: string): KaryawanWithRelations | null {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT 
      k.*,
      p.id_posisi as "pos_id", p.nama_posisi as "pos_nama", p.level_posisi as "pos_level", p.id_organisasi as "pos_org_id",
      o.id_organisasi as "org_id", o.nama_organisasi as "org_nama", o.jenis_organisasi as "org_jenis", o.parent_id as "org_parent",
      s.id_status as "stat_id", s.nama_status as "stat_nama", s.keterangan as "stat_ket"
    FROM karyawan k
    LEFT JOIN posisi p ON k.id_posisi = p.id_posisi
    LEFT JOIN organisasi o ON k.id_organisasi = o.id_organisasi
    LEFT JOIN status_karyawan s ON k.id_status = s.id_status
    WHERE k.id_karyawan = ?
  `).get(id) as Record<string, unknown> | undefined;

  if (!row) return null;

  const alamat = db.prepare("SELECT * FROM alamat WHERE id_karyawan = ?").all(id);
  const pendidikan = db.prepare("SELECT * FROM pendidikan WHERE id_karyawan = ?").all(id);
  const pengalaman = db.prepare("SELECT * FROM pengalaman_kerja WHERE id_karyawan = ?").all(id);
  const riwayat_posisi = db.prepare(`
    SELECT rp.*, p.nama_posisi, p.level_posisi 
    FROM riwayat_posisi rp
    LEFT JOIN posisi p ON rp.id_posisi = p.id_posisi
    WHERE rp.id_karyawan = ?
    ORDER BY rp.tgl_mulai DESC
  `).all(id);
  const riwayat_gaji = db.prepare("SELECT * FROM riwayat_gaji WHERE id_karyawan = ? ORDER BY tgl_mulai DESC").all(id);

  return {
    id_karyawan: row.id_karyawan as string,
    nik: row.nik as string,
    nama: row.nama as string,
    email: row.email as string,
    no_telp: row.no_telp as string | null,
    tempat_lahir: row.tempat_lahir as string | null,
    tgl_lahir: row.tgl_lahir as string | null,
    jenis_kelamin: row.jenis_kelamin as "Laki-laki" | "Perempuan" | null,
    agama: row.agama as string | null,
    foto_url: null,
    ktp_url: null,
    kontrak_url: null,
    id_posisi: row.id_posisi as string,
    id_organisasi: row.id_organisasi as string,
    id_status: row.id_status as string,
    tgl_masuk: row.tgl_masuk as string,
    tgl_keluar: row.tgl_keluar as string | null,
    role: (row.role || "employee") as "admin" | "manager" | "employee",
    user_id: null,
    created_at: row.created_at as string,
    updated_at: row.created_at as string,
    posisi: row.pos_id
      ? {
          id_posisi: row.pos_id as string,
          nama_posisi: row.pos_nama as string,
          level_posisi: row.pos_level as string,
          id_organisasi: row.pos_org_id as string,
          created_at: "",
          updated_at: "",
        }
      : null,
    organisasi: row.org_id
      ? {
          id_organisasi: row.org_id as string,
          nama_organisasi: row.org_nama as string,
          jenis_organisasi: row.org_jenis as "Direktorat" | "Divisi" | "Departemen" | "Unit",
          parent_id: row.org_parent as string | null,
          created_at: "",
          updated_at: "",
        }
      : null,
    status: row.stat_id
      ? {
          id_status: row.stat_id as string,
          nama_status: row.stat_nama as "Tetap" | "Kontrak" | "Probation" | "Magang" | "Non Aktif",
          keterangan: row.stat_ket as string | null,
          created_at: "",
          updated_at: "",
        }
      : null,
    alamat: alamat as unknown as KaryawanWithRelations["alamat"],
    pendidikan: pendidikan as unknown as KaryawanWithRelations["pendidikan"],
    pengalaman: pengalaman as unknown as KaryawanWithRelations["pengalaman"],
    riwayat_posisi: riwayat_posisi as unknown as KaryawanWithRelations["riwayat_posisi"],
    riwayat_gaji: riwayat_gaji as unknown as KaryawanWithRelations["riwayat_gaji"],
  };
}

export function createEmployee(data: {
  nik: string;
  nama: string;
  email: string;
  no_telp?: string;
  id_posisi: string;
  id_organisasi: string;
  id_status: string;
  tgl_masuk: string;
  role?: "admin" | "manager" | "employee";
  alamat_lengkap?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
  gaji_pokok?: number;
  tunjangan?: number;
  potongan?: number;
}): KaryawanWithRelations {
  const db = getDatabase();
  const id_karyawan = crypto.randomUUID();

  const insert = db.transaction(() => {
    db.prepare(`
      INSERT INTO karyawan (
        id_karyawan, nik, nama, email, no_telp, id_posisi, id_organisasi, id_status, tgl_masuk, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id_karyawan,
      data.nik,
      data.nama,
      data.email,
      data.no_telp || null,
      data.id_posisi,
      data.id_organisasi,
      data.id_status,
      data.tgl_masuk,
      data.role || "employee"
    );

    // Initial position record
    db.prepare(`
      INSERT INTO riwayat_posisi (id_riwayat_posisi, id_karyawan, id_posisi, tgl_mulai, keterangan)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      id_karyawan,
      data.id_posisi,
      data.tgl_masuk,
      "Penempatan Awal"
    );

    // Initial salary record
    db.prepare(`
      INSERT INTO riwayat_gaji (id_riwayat_gaji, id_karyawan, gaji_pokok, tunjangan, potongan, tgl_mulai)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      id_karyawan,
      data.gaji_pokok || 12000000,
      data.tunjangan || 2500000,
      data.potongan || 400000,
      data.tgl_masuk
    );

    // Initial address if provided
    if (data.alamat_lengkap) {
      db.prepare(`
        INSERT INTO alamat (id_alamat, id_karyawan, jenis_alamat, alamat, kota, provinsi, kode_pos)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        id_karyawan,
        "KTP",
        data.alamat_lengkap,
        data.kota || "Jakarta Selatan",
        data.provinsi || "DKI Jakarta",
        data.kode_pos || "12000"
      );
    }
  });

  insert();
  return getEmployeeById(id_karyawan)!;
}

export function getOrganizations() {
  const db = getDatabase();
  return db.prepare("SELECT * FROM organisasi ORDER BY jenis_organisasi, nama_organisasi").all();
}

export function getPositions() {
  const db = getDatabase();
  return db.prepare(`
    SELECT p.*, o.nama_organisasi 
    FROM posisi p
    LEFT JOIN organisasi o ON p.id_organisasi = o.id_organisasi
    ORDER BY p.level_posisi, p.nama_posisi
  `).all();
}

export function getPayrolls() {
  const db = getDatabase();
  return db.prepare(`
    SELECT rg.*, k.nama, k.nik, p.nama_posisi, o.nama_organisasi
    FROM riwayat_gaji rg
    JOIN karyawan k ON rg.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON k.id_posisi = p.id_posisi
    LEFT JOIN organisasi o ON k.id_organisasi = o.id_organisasi
    ORDER BY rg.tgl_mulai DESC
  `).all();
}

export function getPositionHistories() {
  const db = getDatabase();
  return db.prepare(`
    SELECT rp.*, k.nama, k.nik, p.nama_posisi, p.level_posisi
    FROM riwayat_posisi rp
    JOIN karyawan k ON rp.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON rp.id_posisi = p.id_posisi
    ORDER BY rp.tgl_mulai DESC
  `).all();
}

export function verifyUser(usernameOrEmail: string, passwordInput: string) {
  const db = getDatabase();
  const user = db.prepare(`
    SELECT * FROM users 
    WHERE (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?))
  `).get(usernameOrEmail, usernameOrEmail) as {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    role: string;
    id_karyawan: string | null;
  } | undefined;

  if (!user) {
    // Special shortcut for user requested admin: password 123
    if (
      (usernameOrEmail.toLowerCase() === "admin" || usernameOrEmail.toLowerCase() === "admin@mai.co.id") &&
      passwordInput === "123"
    ) {
      return {
        id: "admin-id",
        username: "admin",
        email: "admin@mitraaksesinsani.co.id",
        name: "Administrator MAI",
        role: "admin",
      };
    }
    return null;
  }

  if (user.password === passwordInput) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  return null;
}

// ==========================================
// KARYAWAN CRUD MUTATIONS
// ==========================================

export function updateEmployee(
  id: string,
  data: {
    nik?: string;
    nama?: string;
    email?: string;
    no_telp?: string | null;
    tempat_lahir?: string | null;
    tgl_lahir?: string | null;
    jenis_kelamin?: string | null;
    agama?: string | null;
    id_posisi?: string | null;
    id_organisasi?: string | null;
    id_status?: string | null;
    role?: string;
    tgl_masuk?: string;
    tgl_keluar?: string | null;
  }
): KaryawanWithRelations {
  const db = getDatabase();
  const fields: string[] = [];
  const params: unknown[] = [];

  const allowedFields = [
    "nik",
    "nama",
    "email",
    "no_telp",
    "tempat_lahir",
    "tgl_lahir",
    "jenis_kelamin",
    "agama",
    "id_posisi",
    "id_organisasi",
    "id_status",
    "role",
    "tgl_masuk",
    "tgl_keluar",
  ];

  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = ?`);
      params.push((data as Record<string, unknown>)[field]);
    }
  }

  if (fields.length > 0) {
    params.push(id);
    db.prepare(`UPDATE karyawan SET ${fields.join(", ")} WHERE id_karyawan = ?`).run(...params);
  }

  return getEmployeeById(id)!;
}

export function deleteEmployee(id: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM karyawan WHERE id_karyawan = ?").run(id);
  return res.changes > 0;
}

// Sub-entity mutations for Karyawan Detail
export function addAlamat(data: {
  id_karyawan: string;
  jenis_alamat: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
}) {
  const db = getDatabase();
  const id_alamat = crypto.randomUUID();
  db.prepare(`
    INSERT INTO alamat (id_alamat, id_karyawan, jenis_alamat, alamat, kota, provinsi, kode_pos)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id_alamat, data.id_karyawan, data.jenis_alamat, data.alamat, data.kota, data.provinsi, data.kode_pos);
  return db.prepare("SELECT * FROM alamat WHERE id_alamat = ?").get(id_alamat);
}

export function deleteAlamat(id_alamat: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM alamat WHERE id_alamat = ?").run(id_alamat);
  return res.changes > 0;
}

export function addPendidikan(data: {
  id_karyawan: string;
  jenjang: string;
  nama_institusi: string;
  jurusan: string;
  tahun_lulus: number;
}) {
  const db = getDatabase();
  const id_pendidikan = crypto.randomUUID();
  db.prepare(`
    INSERT INTO pendidikan (id_pendidikan, id_karyawan, jenjang, nama_institusi, jurusan, tahun_lulus)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id_pendidikan, data.id_karyawan, data.jenjang, data.nama_institusi, data.jurusan, data.tahun_lulus);
  return db.prepare("SELECT * FROM pendidikan WHERE id_pendidikan = ?").get(id_pendidikan);
}

export function deletePendidikan(id_pendidikan: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM pendidikan WHERE id_pendidikan = ?").run(id_pendidikan);
  return res.changes > 0;
}

export function addPengalaman(data: {
  id_karyawan: string;
  nama_perusahaan: string;
  posisi: string;
  periode_mulai: string;
  periode_selesai: string;
  keterangan?: string | null;
}) {
  const db = getDatabase();
  const id_pengalaman = crypto.randomUUID();
  db.prepare(`
    INSERT INTO pengalaman_kerja (id_pengalaman, id_karyawan, nama_perusahaan, posisi, periode_mulai, periode_selesai, keterangan)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id_pengalaman, data.id_karyawan, data.nama_perusahaan, data.posisi, data.periode_mulai, data.periode_selesai, data.keterangan || null);
  return db.prepare("SELECT * FROM pengalaman_kerja WHERE id_pengalaman = ?").get(id_pengalaman);
}

export function deletePengalaman(id_pengalaman: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM pengalaman_kerja WHERE id_pengalaman = ?").run(id_pengalaman);
  return res.changes > 0;
}

// ==========================================
// ORGANISASI CRUD MUTATIONS
// ==========================================

export function createOrganization(data: {
  nama_organisasi: string;
  jenis_organisasi: string;
  parent_id?: string | null;
}) {
  const db = getDatabase();
  const id_organisasi = crypto.randomUUID();
  db.prepare(`
    INSERT INTO organisasi (id_organisasi, nama_organisasi, jenis_organisasi, parent_id)
    VALUES (?, ?, ?, ?)
  `).run(id_organisasi, data.nama_organisasi, data.jenis_organisasi, data.parent_id || null);
  return db.prepare("SELECT * FROM organisasi WHERE id_organisasi = ?").get(id_organisasi);
}

export function updateOrganization(
  id: string,
  data: {
    nama_organisasi: string;
    jenis_organisasi: string;
    parent_id?: string | null;
  }
) {
  const db = getDatabase();
  db.prepare(`
    UPDATE organisasi 
    SET nama_organisasi = ?, jenis_organisasi = ?, parent_id = ?
    WHERE id_organisasi = ?
  `).run(data.nama_organisasi, data.jenis_organisasi, data.parent_id || null, id);
  return db.prepare("SELECT * FROM organisasi WHERE id_organisasi = ?").get(id);
}

export function deleteOrganization(id: string): boolean {
  const db = getDatabase();
  const del = db.transaction(() => {
    db.prepare("UPDATE organisasi SET parent_id = NULL WHERE parent_id = ?").run(id);
    db.prepare("UPDATE posisi SET id_organisasi = NULL WHERE id_organisasi = ?").run(id);
    db.prepare("UPDATE karyawan SET id_organisasi = NULL WHERE id_organisasi = ?").run(id);
    return db.prepare("DELETE FROM organisasi WHERE id_organisasi = ?").run(id);
  });
  const res = del();
  return res.changes > 0;
}

// ==========================================
// POSISI CRUD MUTATIONS
// ==========================================

export function createPosition(data: {
  nama_posisi: string;
  level_posisi: string;
  id_organisasi?: string | null;
}) {
  const db = getDatabase();
  const id_posisi = crypto.randomUUID();
  db.prepare(`
    INSERT INTO posisi (id_posisi, nama_posisi, level_posisi, id_organisasi)
    VALUES (?, ?, ?, ?)
  `).run(id_posisi, data.nama_posisi, data.level_posisi, data.id_organisasi || null);
  return db.prepare(`
    SELECT p.*, o.nama_organisasi 
    FROM posisi p
    LEFT JOIN organisasi o ON p.id_organisasi = o.id_organisasi
    WHERE p.id_posisi = ?
  `).get(id_posisi);
}

export function updatePosition(
  id: string,
  data: {
    nama_posisi: string;
    level_posisi: string;
    id_organisasi?: string | null;
  }
) {
  const db = getDatabase();
  db.prepare(`
    UPDATE posisi 
    SET nama_posisi = ?, level_posisi = ?, id_organisasi = ?
    WHERE id_posisi = ?
  `).run(data.nama_posisi, data.level_posisi, data.id_organisasi || null, id);
  return db.prepare(`
    SELECT p.*, o.nama_organisasi 
    FROM posisi p
    LEFT JOIN organisasi o ON p.id_organisasi = o.id_organisasi
    WHERE p.id_posisi = ?
  `).get(id);
}

export function deletePosition(id: string): boolean {
  const db = getDatabase();
  const del = db.transaction(() => {
    db.prepare("UPDATE karyawan SET id_posisi = NULL WHERE id_posisi = ?").run(id);
    db.prepare("DELETE FROM riwayat_posisi WHERE id_posisi = ?").run(id);
    db.prepare("DELETE FROM jabatan WHERE id_posisi = ?").run(id);
    return db.prepare("DELETE FROM posisi WHERE id_posisi = ?").run(id);
  });
  const res = del();
  return res.changes > 0;
}

// ==========================================
// RIWAYAT POSISI (MUTASI) CRUD MUTATIONS
// ==========================================

export function createPositionHistory(data: {
  id_karyawan: string;
  id_posisi: string;
  tgl_mulai: string;
  tgl_selesai?: string | null;
  keterangan?: string | null;
}) {
  const db = getDatabase();
  const id_riwayat_posisi = crypto.randomUUID();

  const mutation = db.transaction(() => {
    // If new record doesn't have tgl_selesai, mark existing active position histories for this employee as completed
    if (!data.tgl_selesai) {
      db.prepare(`
        UPDATE riwayat_posisi 
        SET tgl_selesai = ? 
        WHERE id_karyawan = ? AND tgl_selesai IS NULL
      `).run(data.tgl_mulai, data.id_karyawan);
    }

    db.prepare(`
      INSERT INTO riwayat_posisi (id_riwayat_posisi, id_karyawan, id_posisi, tgl_mulai, tgl_selesai, keterangan)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id_riwayat_posisi,
      data.id_karyawan,
      data.id_posisi,
      data.tgl_mulai,
      data.tgl_selesai || null,
      data.keterangan || null
    );

    // Synchronize active employee's position
    db.prepare(`
      UPDATE karyawan 
      SET id_posisi = ? 
      WHERE id_karyawan = ?
    `).run(data.id_posisi, data.id_karyawan);
  });

  mutation();
  return db.prepare(`
    SELECT rp.*, k.nama, k.nik, p.nama_posisi, p.level_posisi
    FROM riwayat_posisi rp
    JOIN karyawan k ON rp.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON rp.id_posisi = p.id_posisi
    WHERE rp.id_riwayat_posisi = ?
  `).get(id_riwayat_posisi);
}

export function updatePositionHistory(
  id: string,
  data: {
    id_posisi?: string;
    tgl_mulai?: string;
    tgl_selesai?: string | null;
    keterangan?: string | null;
  }
) {
  const db = getDatabase();
  const fields: string[] = [];
  const params: unknown[] = [];

  if ("id_posisi" in data && data.id_posisi) {
    fields.push("id_posisi = ?");
    params.push(data.id_posisi);
  }
  if ("tgl_mulai" in data && data.tgl_mulai) {
    fields.push("tgl_mulai = ?");
    params.push(data.tgl_mulai);
  }
  if ("tgl_selesai" in data) {
    fields.push("tgl_selesai = ?");
    params.push(data.tgl_selesai || null);
  }
  if ("keterangan" in data) {
    fields.push("keterangan = ?");
    params.push(data.keterangan || null);
  }

  if (fields.length > 0) {
    params.push(id);
    db.prepare(`UPDATE riwayat_posisi SET ${fields.join(", ")} WHERE id_riwayat_posisi = ?`).run(...params);
  }

  return db.prepare(`
    SELECT rp.*, k.nama, k.nik, p.nama_posisi, p.level_posisi
    FROM riwayat_posisi rp
    JOIN karyawan k ON rp.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON rp.id_posisi = p.id_posisi
    WHERE rp.id_riwayat_posisi = ?
  `).get(id);
}

export function deletePositionHistory(id: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM riwayat_posisi WHERE id_riwayat_posisi = ?").run(id);
  return res.changes > 0;
}

// ==========================================
// RIWAYAT GAJI (PAYROLL) CRUD MUTATIONS
// ==========================================

export function createSalaryRecord(data: {
  id_karyawan: string;
  gaji_pokok: number;
  tunjangan: number;
  potongan: number;
  tgl_mulai: string;
  tgl_selesai?: string | null;
}) {
  const db = getDatabase();
  const id_riwayat_gaji = crypto.randomUUID();

  const insert = db.transaction(() => {
    // If new salary doesn't specify end date, close earlier open salary records
    if (!data.tgl_selesai) {
      db.prepare(`
        UPDATE riwayat_gaji 
        SET tgl_selesai = ? 
        WHERE id_karyawan = ? AND tgl_selesai IS NULL
      `).run(data.tgl_mulai, data.id_karyawan);
    }

    db.prepare(`
      INSERT INTO riwayat_gaji (id_riwayat_gaji, id_karyawan, gaji_pokok, tunjangan, potongan, tgl_mulai, tgl_selesai)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id_riwayat_gaji,
      data.id_karyawan,
      data.gaji_pokok,
      data.tunjangan,
      data.potongan,
      data.tgl_mulai,
      data.tgl_selesai || null
    );
  });

  insert();

  return db.prepare(`
    SELECT rg.*, k.nama, k.nik, p.nama_posisi, o.nama_organisasi
    FROM riwayat_gaji rg
    JOIN karyawan k ON rg.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON k.id_posisi = p.id_posisi
    LEFT JOIN organisasi o ON k.id_organisasi = o.id_organisasi
    WHERE rg.id_riwayat_gaji = ?
  `).get(id_riwayat_gaji);
}

export function updateSalaryRecord(
  id: string,
  data: {
    gaji_pokok?: number;
    tunjangan?: number;
    potongan?: number;
    tgl_mulai?: string;
    tgl_selesai?: string | null;
  }
) {
  const db = getDatabase();
  const fields: string[] = [];
  const params: unknown[] = [];

  if ("gaji_pokok" in data && data.gaji_pokok !== undefined) {
    fields.push("gaji_pokok = ?");
    params.push(data.gaji_pokok);
  }
  if ("tunjangan" in data && data.tunjangan !== undefined) {
    fields.push("tunjangan = ?");
    params.push(data.tunjangan);
  }
  if ("potongan" in data && data.potongan !== undefined) {
    fields.push("potongan = ?");
    params.push(data.potongan);
  }
  if ("tgl_mulai" in data && data.tgl_mulai) {
    fields.push("tgl_mulai = ?");
    params.push(data.tgl_mulai);
  }
  if ("tgl_selesai" in data) {
    fields.push("tgl_selesai = ?");
    params.push(data.tgl_selesai || null);
  }

  if (fields.length > 0) {
    params.push(id);
    db.prepare(`UPDATE riwayat_gaji SET ${fields.join(", ")} WHERE id_riwayat_gaji = ?`).run(...params);
  }

  return db.prepare(`
    SELECT rg.*, k.nama, k.nik, p.nama_posisi, o.nama_organisasi
    FROM riwayat_gaji rg
    JOIN karyawan k ON rg.id_karyawan = k.id_karyawan
    LEFT JOIN posisi p ON k.id_posisi = p.id_posisi
    LEFT JOIN organisasi o ON k.id_organisasi = o.id_organisasi
    WHERE rg.id_riwayat_gaji = ?
  `).get(id);
}

export function deleteSalaryRecord(id: string): boolean {
  const db = getDatabase();
  const res = db.prepare("DELETE FROM riwayat_gaji WHERE id_riwayat_gaji = ?").run(id);
  return res.changes > 0;
}
