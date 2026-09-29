"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // In development mode, unregister any existing service worker and wipe CacheStorage
    // to prevent stale Turbopack chunk caching and hydration mismatches
    if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
            console.log("Unregistered service worker:", registration.scope);
          }
        });
      }

      if ("caches" in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
            console.log("Cleared cache storage:", name);
          }
        });
      }
      return;
    }

    // Only register in production
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.error("PWA Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
