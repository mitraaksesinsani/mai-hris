# MAI HRIS — PT. Mitra Akses Insani

Sistem Informasi Manajemen Sumber Daya Manusia (Human Resource Information System / HRIS) modern berbasis cloud dengan filosofi fondasi:
> **"Satu ID Karyawan, Satu ID Posisi, Satu Sistem Terintegrasi"**

---

## 🚀 Arsitektur & Teknologi Stack

- **Frontend & Routing:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Deployment:** [Vercel](https://vercel.com/) (Edge Ready, Automated CI/CD)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase Auth, Row Level Security, Supabase Storage)
- **Progressive Web App (PWA):** Service Worker (Offline Support, Caching Strategy, Web App Manifest, Installable on Desktop/Mobile)
- **State & Data Fetching:** [TanStack Query v5](https://tanstack.com/query) + `@supabase/ssr` (Server & Client Components)
- **UI & Component System:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Data Table:** [TanStack Table v8](https://tanstack.com/table) (Sorting, Filtering, Pagination)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🗄️ Struktur Database (Mengacu pada ERD PT. MAI)

Database dirancang dengan normalisasi relasi dan pemisahan antara **data master** (posisi saat ini) dan **data transaksi/histori** (effective date tracking).

```
                               ┌───────────────┐
                               │  Organisasi   │ (Hierarki Divisi / Dept / Unit)
                               └───────┬───────┘
                                       │ 1:N
                               ┌───────▼───────┐ 1:N ┌───────────────┐
                               │    Posisi     ├─────►    Jabatan    │
                               └───────┬───────┘     └───────────────┘
                                       │ 1:N
┌──────────────────┐           ┌───────▼───────┐           ┌──────────────────┐
│ Status Karyawan  ├───────────►   KARYAWAN    ◄───────────┤     Alamat       │ (Domisili / KTP)
└──────────────────┘    1:N    └───────┬───────┘    1:N    └──────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │ 1:N                      │ 1:N                      │ 1:N
    ┌───────▼────────┐         ┌───────▼────────┐         ┌───────▼────────┐
    │   Pendidikan   │         │   Pengalaman   │         │ Riwayat Posisi │ (Promosi/Mutasi)
    └────────────────┘         └────────────────┘         └───────┬────────┘
                                                                  │ 1:N
                                                          ┌───────▼────────┐
                                                          │  Riwayat Gaji  │ (Slip / THP)
                                                          └────────────────┘
```

### Rincian 10 Tabel:
1. `organisasi`: Menyimpan hierarki unit kerja (Direktorat, Divisi, Departemen, Unit) dengan self-referencing `parent_id`.
2. `posisi`: Struktur posisi kerja (level staff, lead, manager, executive) terhubung ke unit organisasi.
3. `jabatan`: Detail nama & level jabatan spesifik yang terhubung ke posisi.
4. `status_karyawan`: Master status kontrak (Tetap/PKWTT, Kontrak/PKWT, Probation, Magang).
5. `karyawan`: Data master personil (NIK unik, nama, biodata, kontak, foto, link ke auth user, relasi ke posisi & organisasi).
6. `alamat`: Data alamat ganda (KTP, Domisili, Kantor) per karyawan.
7. `pendidikan`: Riwayat jenjang pendidikan formal (S1, S2, D3, dll.).
8. `pengalaman_kerja`: Rekam jejak pengalaman karir terdahulu karyawan.
9. `riwayat_posisi`: Audit trail mutasi / rotasi dengan pelacakan `tgl_mulai` dan `tgl_selesai`.
10. `riwayat_gaji`: Rekam histori kompensasi (gaji pokok, tunjangan, potongan) yang dilindungi oleh RLS ketat.

---

## 🔒 Keamanan: Row Level Security (RLS) & Storage

### 1. Hak Akses Berdasarkan Role
- **Admin HR:** Akses penuh (Read, Create, Update, Delete) ke seluruh tabel, data riwayat gaji, dan dokumen arsip.
- **Manager:** Akses read-only ke data master posisi, unit organisasi, dan anggota tim di divisinya.
- **Employee:** 
  - Hanya dapat melihat profil diri sendiri (`auth.uid() = user_id`).
  - Dapat memperbarui data alamat dan riwayat pendidikan secara self-service.
  - Dapat mengakses riwayat gaji milik pribadi.

### 2. Supabase Storage Bucket Terproteksi
- Bucket: `employee-documents` (Private / Protected).
- Disertai RLS policy: Karyawan hanya dapat melihat dan mengunggah dokumen (KTP, Kontrak, Foto) di folder ID masing-masing.

---

## 📁 Struktur Folder Modular Next.js App Router

```
mai-hris/
├── .agents/skills/                                # Developer-kit & system installed skills
├── supabase/
│   ├── migrations/
│   │   └── 20260929000001_initial_hris_schema.sql  # DDL Table, PK, FK, Trigger, RLS & Storage Policy
│   └── seed.sql                                    # Data inisial organisasi, posisi, & sampel karyawan
├── public/
│   ├── icons/                                     # PWA App Icons (72x72 s/d 512x512, maskable)
│   ├── manifest.json                              # Web App Manifest PWA
│   ├── sw.js                                      # Service Worker offline cache engine
│   └── offline.html                               # Offline fallback view
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/                             # Halaman login Supabase Auth
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                         # Layout dashboard dengan Sidebar & Header
│   │   │   ├── dashboard/page.tsx                 # Overview KPI, statistik karyawan, & ringkasan
│   │   │   ├── karyawan/
│   │   │   │   ├── page.tsx                       # Master Data Karyawan (TanStack Table)
│   │   │   │   └── [id]/page.tsx                  # Detail Karyawan (Biodata, Dokumen, Histori Gaji)
│   │   │   ├── organisasi/page.tsx                # Hierarki Visual Unit Organisasi PT MAI
│   │   │   ├── posisi/page.tsx                    # Master Posisi & Jabatan
│   │   │   ├── histori/page.tsx                   # Log Mutasi & Riwayat Posisi
│   │   │   └── gaji/page.tsx                      # Histori Payroll & Kompensasi Karyawan
│   │   ├── api/auth/callback/route.ts             # OAuth / Magic link exchange handler
│   │   ├── loading.tsx                            # App Router suspense loading fallback
│   │   ├── error.tsx                              # App Router global error boundary
│   │   ├── not-found.tsx                          # App Router 404 handler
│   │   ├── globals.css                            # Token Tailwind CSS v4 & custom scrollbar
│   │   └── layout.tsx                             # Root layout + TanStack Query Provider + PWA
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx                        # Sidebar navigasi modern
│   │   │   └── header.tsx                         # Topbar dengan status Supabase & user badge
│   │   ├── modules/
│   │   │   ├── karyawan/                          # Data table, dialog tambah karyawan, detail view
│   │   │   └── organisasi/                        # Tree hierarchy renderer
│   │   ├── pwa/                                   # PWA Register, Offline Banner, Install Prompt
│   │   └── ui/                                    # Shadcn UI (Button, Card, Dialog, Table, Tabs, Badge)
│   ├── hooks/
│   │   ├── use-employees.ts                       # TanStack Query hook karyawan
│   │   └── use-organizations.ts                   # TanStack Query hook organisasi & posisi
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                          # Supabase browser client (@supabase/ssr)
│   │   │   ├── server.ts                          # Supabase server client (async cookies)
│   │   │   └── middleware.ts                      # Session refresh handler
│   │   ├── validations/
│   │   │   └── employee.schema.ts                 # Zod schemas (Employee, Salary, Address validation)
│   │   ├── mock-data.ts                           # Mock initial data fallback
│   │   └── utils.ts                               # Formatter Rupiah, tanggal, & cn helper
│   ├── providers/
│   │   └── query-provider.tsx                     # TanStack Query Client Provider
│   ├── types/
│   │   ├── database.types.ts                      # Supabase TypeScript schema types
│   │   └── hris.types.ts                          # Domain & join types
│   └── proxy.ts                                   # Next.js 16 proxy / route protection
├── next.config.ts                                 # OWASP Security Headers & Turbopack config
├── .env.example                                   # Template environment variables
├── package.json
└── tsconfig.json
```

---

## 🛠️ Best Practices & Applied Skills (Developer-Kit & PWA)

Sistem ini menerapkan standar dan pedoman dari `developer-kit` dan ekosistem Next.js 16 modern:

1. **Next.js 16 App Router & Conventions (`nextjs-app-router`, `nextjs-data-fetching`):**
   - Menggunakan `src/proxy.ts` menggantikan middleware legacy Next.js.
   - Mengimplementasikan `loading.tsx` dengan skeleton loader dan `error.tsx` client-side error boundary dengan recovery mechanism.
   - Pemanfaatan cookie asinkron (`await cookies()`) pada `@supabase/ssr` server client.

2. **Validasi Data Ketat (`zod-validation-utilities`):**
   - Skema Zod v4 di `src/lib/validations/employee.schema.ts` untuk validasi format NIK, email, nomor HP, tanggal bergabung, dan nominal gaji.
   - Validasi sinkron dan aman tipe pada form input penambahan karyawan (`add-employee-dialog.tsx`).

3. **Keamanan Aplikasi (`typescript-security-review`, `nextjs-authentication`):**
   - Hardening HTTP Header keamanan OWASP di `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
   - Row Level Security (RLS) PostgreSQL granular untuk Admin, Manager, dan Karyawan.
   - Sanitasi input dan pencegahan SQL Injection melalui query builder parameter Supabase.

4. **Progressive Web App (PWA) Standalone:**
   - Service Worker kustom dengan strategi caching hybrid: *Cache-First* untuk asset statis dan *Network-First* dengan offline fallback untuk dokumen & data navigasi.
   - Deteksi status jaringan real-time via `useSyncExternalStore` tanpa hydration mismatch atau lint warning.
   - Prompt instalasi otomatis yang ramah pengguna.
```

---

## ⚙️ Petunjuk Setup & Menjalankan Project

### 1. Inisialisasi Database di Supabase
1. Buka [Supabase Dashboard](https://app.supabase.com) dan buat project baru.
2. Buka menu **SQL Editor**, salin dan jalankan seluruh isi file:
   ```
   supabase/migrations/20260929000001_initial_hris_schema.sql
   ```
3. Selanjutnya jalankan file seed untuk mengisi data awal PT. Mitra Akses Insani:
   ```
   supabase/seed.sql
   ```

### 2. Konfigurasi Environment Variables
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu isi kredensial dari project Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Menjalankan di Localhost
```bash
npm run dev
```
Buka browser di `http://localhost:3000`. Sistem akan langsung mengarahkan Anda ke Dashboard HRIS.

### 4. Deploy ke Vercel
1. Hubungkan repository GitHub ini ke Vercel.
2. Tambahkan Environment Variables di Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (isi dengan domain Vercel Anda, misal: `https://mai-hris.vercel.app`)
3. Klik **Deploy**!
