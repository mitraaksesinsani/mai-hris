import { NextResponse } from "next/server";
import { addPengalaman, deletePengalaman } from "@/lib/db/queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const created = addPengalaman({ ...body, id_karyawan: id });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/karyawan/[id]/pengalaman error:", error);
    return NextResponse.json({ error: "Gagal menambahkan pengalaman kerja" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_pengalaman = searchParams.get("id_pengalaman");
    if (!id_pengalaman) {
      return NextResponse.json({ error: "id_pengalaman diperlukan" }, { status: 400 });
    }
    const success = deletePengalaman(id_pengalaman);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/karyawan/[id]/pengalaman error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengalaman kerja" }, { status: 500 });
  }
}
