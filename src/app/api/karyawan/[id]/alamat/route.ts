import { NextResponse } from "next/server";
import { addAlamat, deleteAlamat } from "@/lib/db/queries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const created = addAlamat({ ...body, id_karyawan: id });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/karyawan/[id]/alamat error:", error);
    return NextResponse.json({ error: "Gagal menambahkan alamat" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_alamat = searchParams.get("id_alamat");
    if (!id_alamat) {
      return NextResponse.json({ error: "id_alamat diperlukan" }, { status: 400 });
    }
    const success = deleteAlamat(id_alamat);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/karyawan/[id]/alamat error:", error);
    return NextResponse.json({ error: "Gagal menghapus alamat" }, { status: 500 });
  }
}
