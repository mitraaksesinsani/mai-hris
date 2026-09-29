import { z } from "zod";

export const EmployeeNikSchema = z
  .string()
  .min(3, { message: "NIK minimal 3 karakter" })
  .max(50, { message: "NIK maksimal 50 karakter" });

export const EmployeeNameSchema = z
  .string()
  .min(2, { message: "Nama lengkap minimal 2 karakter" })
  .max(150, { message: "Nama maksimal 150 karakter" });

export const EmployeeEmailSchema = z
  .string()
  .email({ message: "Format email tidak valid" })
  .max(150, { message: "Email maksimal 150 karakter" });

export const EmployeePhoneSchema = z
  .string()
  .regex(/^(\+62|62|0)[0-9]{8,15}$/, { message: "Format nomor telepon/WhatsApp tidak valid" })
  .optional()
  .or(z.literal(""));

export const CreateEmployeeSchema = z.object({
  nik: EmployeeNikSchema,
  nama: EmployeeNameSchema,
  email: EmployeeEmailSchema,
  no_telp: EmployeePhoneSchema,
  id_organisasi: z.string().uuid({ message: "Pilih unit organisasi yang valid" }),
  id_posisi: z.string().uuid({ message: "Pilih posisi yang valid" }),
  id_status: z.string().uuid({ message: "Pilih status kepegawaian yang valid" }),
  tgl_masuk: z.string().min(1, { message: "Tanggal masuk wajib diisi" }),
  role: z.enum(["admin", "manager", "employee"], { message: "Pilih role yang valid" }),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;

export const UpdateSalarySchema = z.object({
  id_karyawan: z.string().uuid(),
  gaji_pokok: z.coerce.number().min(0, { message: "Gaji pokok minimal 0" }),
  tunjangan: z.coerce.number().min(0, { message: "Tunjangan minimal 0" }),
  potongan: z.coerce.number().min(0, { message: "Potongan minimal 0" }),
  tgl_mulai: z.string().min(1, { message: "Tanggal mulai berlaku wajib diisi" }),
  tgl_selesai: z.string().optional().nullable(),
});

export type UpdateSalaryInput = z.infer<typeof UpdateSalarySchema>;
