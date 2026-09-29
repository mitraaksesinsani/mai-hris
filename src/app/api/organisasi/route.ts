import { NextResponse } from "next/server";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const orgs = getOrganizations();
    return NextResponse.json(orgs);
  } catch (error) {
    console.error("GET /api/organisasi error:", error);
    return NextResponse.json({ error: "Gagal mengambil data organisasi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nama_organisasi || !body.jenis_organisasi) {
      return NextResponse.json(
        { error: "Nama organisasi dan jenis organisasi wajib diisi" },
        { status: 400 }
      );
    }
    const newOrg = createOrganization(body);
    return NextResponse.json(newOrg, { status: 201 });
  } catch (error) {
    console.error("POST /api/organisasi error:", error);
    return NextResponse.json({ error: "Gagal menambahkan organisasi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_organisasi, ...data } = body;
    if (!id_organisasi) {
      return NextResponse.json({ error: "id_organisasi wajib diisi" }, { status: 400 });
    }
    const updated = updateOrganization(id_organisasi, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/organisasi error:", error);
    return NextResponse.json({ error: "Gagal memperbarui organisasi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID organisasi diperlukan" }, { status: 400 });
    }
    const success = deleteOrganization(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/organisasi error:", error);
    return NextResponse.json({ error: "Gagal menghapus organisasi" }, { status: 500 });
  }
}
