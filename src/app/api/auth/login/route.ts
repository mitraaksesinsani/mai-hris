import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/db/queries";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username/Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    const user = verifyUser(username, password);
    if (!user) {
      return NextResponse.json(
        { error: "Kredensial tidak valid. Silakan periksa username atau kata sandi." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("mai_hris_session", JSON.stringify(user), {
      httpOnly: false, // allow client components to read user session profile
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user,
      message: "Login berhasil sebagai Administrator MAI",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat login" },
      { status: 500 }
    );
  }
}
