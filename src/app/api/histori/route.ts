import { NextResponse } from "next/server";
import {
  getPositionHistories,
  createPositionHistory,
  updatePositionHistory,
  deletePositionHistory,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const histories = getPositionHistories();
    return NextResponse.json(histories);
  } catch (error) {
    console.error("GET /api/histori error:", error);
    return NextResponse.json({ error: "Gagal mengambil data riwayat mutasi & posisi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id_karyawan || !body.id_posisi || !body.tgl_mulai) {
      return NextResponse.json(
        { error: "Karyawan, Posisi Baru, dan Tanggal Mulai wajib diisi" },
        { status: 400 }
      );
    }
    const newRecord = createPositionHistory(body);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST /api/histori error:", error);
    return NextResponse.json({ error: "Gagal mencatat mutasi / riwayat posisi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_riwayat_posisi, ...data } = body;
    if (!id_riwayat_posisi) {
      return NextResponse.json({ error: "id_riwayat_posisi wajib diisi" }, { status: 400 });
    }
    const updated = updatePositionHistory(id_riwayat_posisi, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/histori error:", error);
    return NextResponse.json({ error: "Gagal memperbarui riwayat posisi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID riwayat posisi diperlukan" }, { status: 400 });
    }
    const success = deletePositionHistory(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/histori error:", error);
    return NextResponse.json({ error: "Gagal menghapus riwayat posisi" }, { status: 500 });
  }
}
