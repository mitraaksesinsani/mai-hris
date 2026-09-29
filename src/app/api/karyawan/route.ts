import { NextResponse } from "next/server";
import { getEmployees, createEmployee } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const employees = getEmployees(search);
    return NextResponse.json(employees);
  } catch (error) {
    console.error("GET /api/karyawan error:", error);
    return NextResponse.json({ error: "Gagal mengambil data karyawan dari database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEmployee = createEmployee(body);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("POST /api/karyawan error:", error);
    return NextResponse.json({ error: "Gagal menambahkan karyawan ke database" }, { status: 500 });
  }
}
