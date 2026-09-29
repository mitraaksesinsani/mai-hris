"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error caught by App Router ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive mb-3 border border-destructive/20">
        <AlertCircle className="size-5" />
      </div>
      <h2 className="font-heading text-base font-semibold text-foreground">Terjadi Kesalahan pada Sistem</h2>
      <p className="mt-1 max-w-md text-xs text-muted-foreground leading-relaxed">
        {error.message || "Gagal memproses permintaan data. Silakan coba kembali beberapa saat lagi."}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => reset()} size="sm" className="gap-2 text-xs">
          <RotateCcw className="size-3.5" />
          <span>Muat Ulang Halaman</span>
        </Button>
      </div>
    </div>
  );
}
