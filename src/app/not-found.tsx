import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border">
        <FileQuestion className="size-6" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">404</h1>
      <h2 className="mt-1 text-sm font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
        Halaman atau modul HRIS yang Anda cari tidak tersedia atau tautan telah berpindah.
      </p>
      <div className="mt-5">
        <Button asChild size="sm" className="gap-2 text-xs">
          <Link href="/dashboard">
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
