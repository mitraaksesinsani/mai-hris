export default function Loading() {
  return (
    <div className="flex h-64 w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Memuat data MAI HRIS...</p>
      </div>
    </div>
  );
}
