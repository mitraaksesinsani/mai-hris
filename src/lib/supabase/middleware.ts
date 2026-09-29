import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not run Supabase getUser on static assets or favicon
  const user = await supabase.auth.getUser();

  // Route protection logic
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/karyawan") ||
    request.nextUrl.pathname.startsWith("/organisasi") ||
    request.nextUrl.pathname.startsWith("/posisi") ||
    request.nextUrl.pathname.startsWith("/histori") ||
    request.nextUrl.pathname.startsWith("/gaji");

  const hasMaiSession = request.cookies.has("mai_hris_session");

  // Jika sudah login dan mengakses login page
  if ((user.data.user || hasMaiSession) && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Jika belum login dan mengakses halaman terproteksi
  if (!user.data.user && !hasMaiSession && isProtectedRoute && !supabaseUrl.includes("sample-project")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
