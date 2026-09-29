import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mai_hris_session");

  if (!session?.value) {
    // Default fallback to Admin for demo convenience
    return NextResponse.json({
      user: {
        id: "admin-id",
        username: "admin",
        email: "admin@mitraaksesinsani.co.id",
        name: "Administrator MAI",
        role: "admin",
      },
    });
  }

  try {
    const user = JSON.parse(session.value);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
