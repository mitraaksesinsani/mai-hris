import { NextResponse } from "next/server";
import {
  getPayrolls,
  createSalaryRecord,
  updateSalaryRecord,
  deleteSalaryRecord,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const payrolls = getPayrolls();
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error("GET /api/gaji error:", error);
    return NextResponse.json({ error: "Gagal mengambil data riwayat gaji" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id_karyawan || body.gaji_pokok === undefined || !body.tgl_mulai) {
      return NextResponse.json(
        { error: "Karyawan, Gaji Pokok, dan Tanggal Mulai wajib diisi" },
        { status: 400 }
      );
    }
    const newSalary = createSalaryRecord({
      id_karyawan: body.id_karyawan,
      gaji_pokok: Number(body.gaji_pokok),
      tunjangan: Number(body.tunjangan || 0),
      potongan: Number(body.potongan || 0),
      tgl_mulai: body.tgl_mulai,
      tgl_selesai: body.tgl_selesai || null,
    });
    return NextResponse.json(newSalary, { status: 201 });
  } catch (error) {
    console.error("POST /api/gaji error:", error);
    return NextResponse.json({ error: "Gagal menyimpan riwayat gaji" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_riwayat_gaji, ...data } = body;
    if (!id_riwayat_gaji) {
      return NextResponse.json({ error: "id_riwayat_gaji wajib diisi" }, { status: 400 });
    }
    const updated = updateSalaryRecord(id_riwayat_gaji, {
      ...data,
      gaji_pokok: data.gaji_pokok !== undefined ? Number(data.gaji_pokok) : undefined,
      tunjangan: data.tunjangan !== undefined ? Number(data.tunjangan) : undefined,
      potongan: data.potongan !== undefined ? Number(data.potongan) : undefined,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/gaji error:", error);
    return NextResponse.json({ error: "Gagal memperbarui riwayat gaji" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID riwayat gaji diperlukan" }, { status: 400 });
    }
    const success = deleteSalaryRecord(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/gaji error:", error);
    return NextResponse.json({ error: "Gagal menghapus riwayat gaji" }, { status: 500 });
  }
}
