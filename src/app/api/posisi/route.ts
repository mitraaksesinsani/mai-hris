import { NextResponse } from "next/server";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const pos = getPositions();
    return NextResponse.json(pos);
  } catch (error) {
    console.error("GET /api/posisi error:", error);
    return NextResponse.json({ error: "Gagal mengambil data posisi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nama_posisi || !body.level_posisi) {
      return NextResponse.json(
        { error: "Nama posisi dan level posisi wajib diisi" },
        { status: 400 }
      );
    }
    const newPos = createPosition(body);
    return NextResponse.json(newPos, { status: 201 });
  } catch (error) {
    console.error("POST /api/posisi error:", error);
    return NextResponse.json({ error: "Gagal menambahkan posisi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_posisi, ...data } = body;
    if (!id_posisi) {
      return NextResponse.json({ error: "id_posisi wajib diisi" }, { status: 400 });
    }
    const updated = updatePosition(id_posisi, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/posisi error:", error);
    return NextResponse.json({ error: "Gagal memperbarui posisi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID posisi diperlukan" }, { status: 400 });
    }
    const success = deletePosition(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/posisi error:", error);
    return NextResponse.json({ error: "Gagal menghapus posisi" }, { status: 500 });
  }
}
