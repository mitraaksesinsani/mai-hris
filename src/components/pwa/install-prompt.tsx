"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
          <Download className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground">Install Aplikasi MAI HRIS</h4>
          <p className="text-[11px] text-muted-foreground">Akses langsung dari desktop / perangkat</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button size="xs" onClick={handleInstallClick} className="text-xs h-7">
          Install
        </Button>
        <button
          onClick={() => setShowPrompt(false)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
