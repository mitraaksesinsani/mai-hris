"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

export function OfflineBanner() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900 shadow-lg backdrop-blur-md">
      <WifiOff className="h-4 w-4 text-amber-600 animate-pulse" />
      <span>Anda sedang offline. Data ditampilkan dari cache lokal.</span>
    </div>
  );
}
