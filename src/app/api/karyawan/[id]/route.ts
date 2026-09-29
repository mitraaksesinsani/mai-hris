import { NextResponse } from "next/server";
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/lib/db/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = getEmployeeById(id);

    if (!employee) {
      return NextResponse.json({ error: "Karyawan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("GET /api/karyawan/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil detail karyawan" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateEmployee(id, body);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/karyawan/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data karyawan" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteEmployee(id);

    if (!success) {
      return NextResponse.json({ error: "Karyawan tidak ditemukan atau gagal dihapus" }, { status: 404 });
    }

    return NextResponse.json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/karyawan/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus karyawan dari database" }, { status: 500 });
  }
}
