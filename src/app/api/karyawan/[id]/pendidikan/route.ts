import { NextResponse } from "next/server";
import { addPendidikan, deletePendidikan } from "@/lib/db/queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const created = addPendidikan({
      ...body,
      id_karyawan: id,
      tahun_lulus: Number(body.tahun_lulus),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/karyawan/[id]/pendidikan error:", error);
    return NextResponse.json({ error: "Gagal menambahkan riwayat pendidikan" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_pendidikan = searchParams.get("id_pendidikan");
    if (!id_pendidikan) {
      return NextResponse.json({ error: "id_pendidikan diperlukan" }, { status: 400 });
    }
    const success = deletePendidikan(id_pendidikan);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/karyawan/[id]/pendidikan error:", error);
    return NextResponse.json({ error: "Gagal menghapus riwayat pendidikan" }, { status: 500 });
  }
}
