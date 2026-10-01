"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FolderGit2, Lock, User, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("123");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const userToSubmit = customUser || username;
    const passToSubmit = customPass || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userToSubmit,
          password: passToSubmit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali user dan kata sandi.");
      }

      // Store in localStorage for fast client-side presence display
      if (data.user) {
        localStorage.setItem("mai_user", JSON.stringify(data.user));
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat otentikasi";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setUsername("admin");
    setPassword("123");
    handleLogin(undefined, "admin", "123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-5">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src="/logo.png"
              alt="MAI HRIS"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
            MAI HRIS Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            PT. Mitra Akses Insani — Sistem Informasi Sumber Daya Manusia
          </p>
        </div>

        {/* Quick Demo Access Action */}
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground border border-border">
                <KeyRound className="h-3.5 w-3.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">Kredensial Default</p>
                <p className="text-[11px] text-muted-foreground">admin &nbsp;|&nbsp; 123</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleQuickAdminLogin}
              disabled={loading}
              className="text-xs h-7 px-2.5 font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Login Cepat</span>
            </Button>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border">
          <CardHeader className="space-y-1 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Masuk ke Akun</CardTitle>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Database Aktif
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Masukkan kredensial user untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-medium">Username / Email</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-8 text-xs h-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium">Kata Sandi</Label>
                  <span className="text-[11px] text-muted-foreground hover:underline cursor-pointer">
                    Lupa sandi?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-8 text-xs h-8"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 text-xs font-medium h-8"
              >
                <span>{loading ? "Memverifikasi..." : "Masuk ke Sistem"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="mt-4 rounded-lg bg-muted/40 p-2.5 border border-border text-[11px] text-muted-foreground">
              <p className="font-medium text-foreground">Akun Terdaftar di SQLite:</p>
              <div className="mt-1.5 flex items-center justify-between rounded-md bg-card p-1.5 border border-border text-[11px]">
                <span className="font-medium text-foreground">Administrator</span>
                <span className="text-muted-foreground">admin / 123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
