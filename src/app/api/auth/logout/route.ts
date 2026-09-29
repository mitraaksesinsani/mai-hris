import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("mai_hris_session");
  return NextResponse.json({ success: true, message: "Berhasil keluar dari sistem" });
}
